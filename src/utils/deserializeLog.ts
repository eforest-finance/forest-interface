import { IClaimDropResult, ITransactionResult } from 'contract/type';
import AElf from './aelf';
import { Proto } from './proto';
import { SentryMessageType, captureMessage } from './captureMessage';

export interface ITransactionLog {
  Address: string;
  Name: string;
  Indexed: string[];
  NonIndexed: string;
}

function decodeBase64(str: string) {
  const { util } = AElf.pbjs;
  const buffer = util.newBuffer(util.base64.length(str));
  util.base64.decode(str, buffer, 0);
  return buffer;
}

export async function getProto(address: string, rpc: string) {
  try {
    const aelf = new AElf(new AElf.providers.HttpProvider(rpc));
    const file = await aelf.chain.getContractFileDescriptorSet(address);
    const content = AElf.pbjs.Root.fromDescriptor(file);

    return content;
  } catch (e) {
    return null;
  }
}

function getDeserializeLogResult(serializedData: any, dataType: any) {
  let deserializeLogResult = serializedData.reduce((acc: any, v: any) => {
    let deserialize = dataType.decode(decodeBase64(v));
    deserialize = dataType.toObject(deserialize, {
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      bytes: String, // bytes as base64 encoded strings
      defaults: false, // includes default values
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true, // includes virtual oneof fields set to the present field's name
    });
    return {
      ...acc,
      ...deserialize,
    };
  }, {});
  // eslint-disable-next-line max-len
  deserializeLogResult = AElf.utils.transform.transform(
    dataType,
    deserializeLogResult,
    AElf.utils.transform.OUTPUT_TRANSFORMERS,
  );
  deserializeLogResult = AElf.utils.transform.transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
}

export async function deserializeLog(log: ITransactionLog, proto: any) {
  try {
    const { Indexed = [], NonIndexed, Name } = log;

    if (!proto) {
      return {};
    }
    const serializedData = [...(Indexed || [])];
    if (NonIndexed) {
      serializedData.push(NonIndexed);
    }

    const dataType = proto.lookupType(Name);

    const deserializeLogResult = getDeserializeLogResult(serializedData, dataType);
    return deserializeLogResult;
  } catch (error) {
    return Promise.reject(error);
  }
}

const sendMessage = <T, R>({
  contractAddress,
  TransactionResult,
  TransactionId,
  errorMsg,
  proto,
  name,
}: {
  contractAddress: string;
  TransactionResult: ITransactionResult;
  TransactionId: string;
  errorMsg?: R;
  proto?: T;
  name: string;
}) => {
  captureMessage({
    type: SentryMessageType.HTTP,
    params: {
      name,
      method: 'get',
      query: {
        contractAddress,
        TransactionId,
      },
      description: {
        TransactionResult,
        proto,
        errorMsg,
      },
    },
  });
};

export const getResult = async (
  contractAddress: string,
  logsName: string,
  TransactionResult: ITransactionResult,
  TransactionId: string,
) => {
  const proto = Proto.getInstance().getProto();
  const currentProto = proto[contractAddress];
  if (currentProto) {
    console.log('TransactionResult?.Logs', TransactionResult?.Logs);
    const log = TransactionResult?.Logs?.filter((item) => {
      return item.Name === logsName;
    })?.[0];
    if (log) {
      try {
        const logResult: IClaimDropResult = await deserializeLog(log, currentProto);
        return logResult;
      } catch (error) {
        sendMessage({
          name: `${logsName} DeserializeLog`,
          contractAddress,
          TransactionResult,
          TransactionId,
          errorMsg: error,
        });
        return false;
      }
    } else {
      sendMessage({
        name: `${logsName} DeserializeLog`,
        contractAddress,
        TransactionResult,
        TransactionId,
        errorMsg: 'no log events',
      });
      return false;
    }
  } else {
    sendMessage({
      name: `${logsName} DeserializeLog`,
      contractAddress,
      TransactionResult,
      TransactionId,
      errorMsg: 'no proto',
      proto,
    });
    return false;
  }
};
