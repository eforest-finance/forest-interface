import { ChainId, IPortkeyProvider } from '@portkey/provider-types';

import { getContractMethods } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
const AElf = require('aelf-sdk');

export function getAElf(rpcUrl: string) {
  return new AElf(new AElf.providers.HttpProvider(rpcUrl));
}

type IHandleTransactionParams = {
  contractAddress: string;
  args: any;
  methodName: string;
  instance: any;
};

export const handleTransactionParams = async ({
  contractAddress,
  args,
  methodName,
  instance,
}: IHandleTransactionParams) => {
  const methods = await getContractMethods(instance, contractAddress);
  const protoInputType = methods[methodName];

  let input = AElf.utils.transform.transformMapToArray(protoInputType, args);

  input = AElf.utils.transform.transform(protoInputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);

  const message = protoInputType.fromObject(input);

  return protoInputType.encode(message).finish();
};

const getSignature = async ({ provider, data, address }: { provider: any; data: string; address: string }) => {
  const result = await provider.getSignature({
    address,
    hexToBeSign: data,
  });
  return result.signature;
};

export type GetRawTx = {
  blockHeightInput: string;
  blockHashInput: string;
  packedInput: string;
  address: string;
  contractAddress: string;
  functionName: string;
};

export const getRawTx = ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
}: GetRawTx) => {
  const rawTx = AElf.pbUtils.getTransaction(address, contractAddress, functionName, packedInput);
  rawTx.refBlockNumber = blockHeightInput;
  const blockHash = blockHashInput.match(/^0x/) ? blockHashInput.substring(2) : blockHashInput;
  rawTx.refBlockPrefix = Buffer.from(blockHash, 'hex').slice(0, 4);
  return rawTx;
};

export const handleTransaction = async ({
  blockHeightInput,
  blockHashInput,
  packedInput,
  address,
  contractAddress,
  functionName,
  provider,
}: GetRawTx & { provider: IPortkeyProvider }) => {
  // Create transaction
  const rawTx = getRawTx({
    blockHeightInput,
    blockHashInput,
    packedInput,
    address,
    contractAddress,
    functionName,
  });
  rawTx.params = Buffer.from(rawTx.params, 'hex');

  const ser = AElf.pbUtils.Transaction.encode(rawTx).finish();

  const m = AElf.utils.sha256(ser);
  // signature
  const signatureStr = await getSignature({ provider, data: m, address });
  if (!signatureStr) return;

  let tx = {
    ...rawTx,
    signature: Buffer.from(signatureStr, 'hex'),
  };

  tx = AElf.pbUtils.Transaction.encode(tx).finish();
  if (tx instanceof Buffer) {
    return tx.toString('hex');
  }
  return AElf.utils.uint8ArrayToHex(tx); // hex params
};

export interface CreateTransactionParams {
  contractAddress: string;
  params: any;
  chainId: ChainId;
  methodName: string;
  rpcUrl: string;
  account: string;
}

export const getRawTransactionNightELF = async ({
  account,
  contractAddress,
  params,
  chainId,
  methodName,
  rpcUrl,
}: CreateTransactionParams) => {
  const provider = new (window as any).NightElf.AElf({
    httpProvider: [rpcUrl],
    appName: 'forest',
    pure: true,
  });

  const instance = aelf.getAelfInstance(rpcUrl);

  const result = await handleTransactionParams({
    contractAddress,
    methodName,
    args: params,
    instance,
  });

  const transactionParams = AElf.utils.uint8ArrayToHex(result);

  const aelfInstance = getAElf(rpcUrl);
  const { BestChainHeight, BestChainHash } = await aelfInstance.chain.getChainStatus();

  const transaction = await handleTransaction({
    blockHeightInput: BestChainHeight,
    blockHashInput: BestChainHash,
    packedInput: transactionParams,
    address: account,
    contractAddress,
    functionName: methodName,
    provider,
  });
  return transaction;
};
