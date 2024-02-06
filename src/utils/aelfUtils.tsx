import { message } from 'antd';
import { getExploreLink, shortenString, sleep } from 'utils';
import BigNumber from 'bignumber.js';
import AElf from './aelf';
import { timesDecimals } from './calculate';
import { isMobile } from 'react-device-detect';
import protobuf from '@aelfqueen/protobufjs';
import { Approve, GetAllowance } from 'contract/multiToken';
import { IContractError, IPrice } from 'contract/type';
import { getRpcUrls } from 'constants/url';
import { CONTRACT_AMOUNT } from 'constants/common';
import { store } from 'store/store';
import { DEFAULT_ERROR } from 'constants/errorMessage';
import { GetTotalEffectiveListedNFTAmount, GetTotalOfferAmount } from 'contract/market';
import { SupportedELFChainId } from 'constants/chain';
const { transform, decodeAddressRep } = AElf.utils;

const httpProviders: any = {};
export function getAElf(rpcUrl?: string) {
  const rpc = rpcUrl || '';
  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

export const approveELF = async (spender: string, symbol: string, amount: string, chainId?: Chain) => {
  try {
    const approveResult = await Approve(
      {
        spender: spender,
        symbol,
        amount,
      },
      {
        chain: chainId,
      },
    );

    if (approveResult.error) {
      message.error(approveResult?.errorMessage?.message || DEFAULT_ERROR);
      return false;
    }

    const { TransactionId } = approveResult.result || approveResult;

    if (chainId) {
      await MessageTxToExplore(TransactionId!, chainId);
    }

    return true;
  } catch (error) {
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    }
    return false;
  }
};

export const approveNFT: ApproveFunc = async ({ nftInfo, spender, chainId }) => {
  try {
    const approveResult = await Approve(
      {
        spender,
        symbol: nftInfo.symbol,
        amount: CONTRACT_AMOUNT,
      },
      {
        chain: chainId,
      },
    );
    if (!approveResult) return false;

    if (approveResult?.error) {
      message.error(approveResult.errorMessage?.message || DEFAULT_ERROR);
      return false;
    }

    const { TransactionId } = approveResult.result || approveResult;
    await MessageTxToExplore(TransactionId!, chainId);
    return true;
  } catch (error) {
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError.errorMessage?.message);
    }
    return false;
  }
};

export const approve = async (spender: string, symbol: string, amount: string, chainId?: Chain) => {
  try {
    const approveResult = await Approve(
      {
        spender: spender,
        symbol,
        amount,
      },
      {
        chain: chainId,
      },
    );

    if (!approveResult || approveResult.error) {
      message.error(approveResult?.errorMessage?.message || DEFAULT_ERROR);
      return false;
    }

    const { TransactionId } = approveResult.result || approveResult;

    if (chainId) {
      await MessageTxToExplore(TransactionId!, chainId);
    }

    return true;
  } catch (error) {
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError?.errorMessage?.message || DEFAULT_ERROR);
    }
    return false;
  }
};

export function getBlockHeight() {
  return getAElf().chain.getBlockHeight();
}

export async function getTxResult(
  TransactionId: string,
  chainId: Chain,
  reGetCount = 0,
  retryCountWhenNotExist = 0,
): Promise<any> {
  const rpcUrl = getRpcUrls()[chainId];
  const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    throw Error('Failed to retrieve transaction result.');
  }

  if (txResult.Status.toLowerCase() === 'notexisted') {
    if (retryCountWhenNotExist > 5) {
      throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
    }
    await sleep(1000);
    retryCountWhenNotExist++;
    return getTxResult(TransactionId, chainId, reGetCount, retryCountWhenNotExist);
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    // || txResult.Status.toLowerCase() === 'notexisted'
    if (reGetCount > 10) {
      throw Error(`Timeout. Transaction ID:${TransactionId}`);
    }
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, chainId, reGetCount, retryCountWhenNotExist);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return { TransactionId, txResult };
  }

  throw Error({ ...txResult.Error, TransactionId } || 'Transaction error');
}

export function messageHTML(
  txId: string,
  type: 'success' | 'error' | 'warning' = 'success',
  chainName?: Chain,
  moreMessage = '',
) {
  const aProps = isMobile ? {} : { target: '_blank', rel: 'noreferrer' };
  const explorerHref = chainName && getExploreLink(txId, 'transaction', chainName);
  const txIdHTML = (
    <span>
      <span>
        Transaction ID: &nbsp;
        <a href={explorerHref} className="break-all" {...aProps}>
          {shortenString(txId || '', 8)}
        </a>
      </span>
      <br />
      {moreMessage && <span>{moreMessage.replace('AElf.Sdk.CSharp.AssertionException:', '')}</span>}
    </span>
  );
  message[type](txIdHTML, 10);
}

export async function MessageTxToExplore(
  txId: string,
  chainId: Chain,
  type: 'success' | 'error' | 'warning' = 'success',
) {
  try {
    const validTxId = (await getTxResult(txId, chainId)).TransactionId;
    messageHTML(validTxId, type, chainId);
  } catch (e: any) {
    if (e.TransactionId) {
      messageHTML(txId, 'error', e.Error || 'Transaction error.', chainId);
    } else {
      messageHTML(txId, 'error', e.message || 'Transaction error.', chainId);
    }
  }
}

export const checkTokenApproveCurrying = () => {
  return async (options: {
    chainId?: Chain;
    symbol: string;
    address: string;
    spender: string;
    amount: string | number;
    decimals?: number;
    approveSymbol?: string;
  }) => {
    const { chainId, symbol, address, spender, amount, decimals, approveSymbol } = options;
    try {
      const allowance = await GetAllowance(
        {
          symbol: approveSymbol || 'ELF',
          owner: address,
          spender: spender,
        },
        {
          chain: chainId,
        },
      );

      if (allowance.error) {
        message.error(allowance.errorMessage?.message || allowance.error.toString() || DEFAULT_ERROR);
        return false;
      }

      const bigA = timesDecimals(amount, decimals ?? 8);

      const allowanceBN = new BigNumber(allowance?.allowance);

      if (allowanceBN.lt(bigA)) {
        return await approveELF(spender, approveSymbol || 'ELF', `${bigA.toNumber()}`, chainId);
      }
      return true;
    } catch (error) {
      message.destroy();
      const resError = error as unknown as IContractError;
      if (resError) {
        message.error(resError.errorMessage?.message || DEFAULT_ERROR);
      }
      return false;
    }
  };
};

const isNightEl = () => {
  const walletInfo = localStorage.getItem('wallet-info');
  const walletInfoObj = walletInfo ? JSON.parse(walletInfo) : {};
  let isNightElStatus = true;
  if (walletInfoObj?.discoverInfo || walletInfoObj?.portkeyInfo) {
    isNightElStatus = false;
  }

  return isNightElStatus;
};

export const checkELFApprove = async (options: {
  chainId?: Chain;
  address: string;
  spender: string;
  price: IPrice;
  quantity: number;
}) => {
  const { price, chainId, address, spender, quantity } = options;
  try {
    const res = await GetTotalOfferAmount(
      {
        address,
        priceSymbol: `${price.symbol}`,
      },
      {
        chain: chainId,
      },
    );

    if (res?.error) {
      message.error(res?.errorMessage?.message || res.error.toString() || DEFAULT_ERROR);
      return false;
    }

    const bigA = new BigNumber(price.amount);

    if (res) {
      const totalAmount = new BigNumber(res?.totalAmount ?? 0);
      const allowanceBN = new BigNumber(res?.allowance ?? 0);

      if (allowanceBN.lt(BigNumber.sum(bigA.multipliedBy(quantity), totalAmount))) {
        const amount = isNightEl() ? CONTRACT_AMOUNT : Number(BigNumber.sum(totalAmount, bigA.multipliedBy(quantity)));
        return await approve(spender, 'ELF', `${amount}`, chainId);
      }
      return true;
    } else {
      const amount = isNightEl() ? CONTRACT_AMOUNT : Number(Number(bigA.multipliedBy(quantity)));
      return await approve(spender, 'ELF', `${amount}`, chainId);
    }
  } catch (error) {
    message.destroy();
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
    }
    return false;
  }
};

export const checkNFTApprove = async (options: {
  chainId?: Chain;
  address: string;
  spender: string;
  symbol: string;
  amount: number;
}) => {
  const { symbol, amount, chainId, address, spender } = options;
  try {
    const res = await GetTotalEffectiveListedNFTAmount(
      {
        symbol,
        address,
      },
      {
        chain: chainId,
      },
    );

    if (res?.error) {
      message.error(res?.errorMessage?.message || res.error.toString() || DEFAULT_ERROR);
      return false;
    }

    const bigA = new BigNumber(amount);

    if (res) {
      const totalAmount = new BigNumber(res?.totalAmount ?? 0);
      const allowanceBN = new BigNumber(res?.allowance ?? 0);
      if (allowanceBN.lt(BigNumber.sum(bigA, totalAmount))) {
        const amount = isNightEl() ? CONTRACT_AMOUNT : Number(BigNumber.sum(totalAmount, bigA));
        return await approve(spender, symbol, `${amount}`, chainId);
      }
      return true;
    } else {
      const amount = isNightEl() ? CONTRACT_AMOUNT : Number(bigA);
      return await approve(spender, symbol, `${amount}`, chainId);
    }
  } catch (error) {
    message.destroy();
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
    }
    return false;
  }
};

export const checkELFAllowance = async (options: {
  spender: string;
  address: string;
  chainId?: Chain;
  symbol?: string;
  decimals?: number;
  amount: string;
}) => {
  const { chainId, symbol = 'ELF', address, spender, amount, decimals = 8 } = options;
  try {
    const allowance = await GetAllowance(
      {
        symbol: symbol,
        owner: address,
        spender: spender,
      },
      {
        chain: chainId,
      },
    );

    if (allowance.error) {
      message.error(allowance.errorMessage?.message || allowance.error.toString() || DEFAULT_ERROR);
      return false;
    }

    const bigA = timesDecimals(amount, decimals ?? 8);

    const allowanceBN = new BigNumber(allowance?.allowance);

    if (allowanceBN.lt(bigA)) {
      const approveAmount = isNightEl() ? CONTRACT_AMOUNT : bigA.toNumber();
      return await approveELF(spender, symbol, `${approveAmount}`, chainId);
    }
    return true;
  } catch (error) {
    message.destroy();
    const resError = error as unknown as IContractError;
    if (resError) {
      message.error(resError.errorMessage?.message || DEFAULT_ERROR);
    }
    return false;
  }
};

type ApproveFunc = (params: {
  nftInfo: { symbol: string; tokenId: number | string };
  owner?: string;
  spender: string;
  amount?: number | string;
  count?: number;
  chainId: Chain;
}) => Promise<boolean>;

const isWrappedBytes = (resolvedType: any, name: string) => {
  if (!resolvedType.name || resolvedType.name !== name) {
    return false;
  }
  if (!resolvedType.fieldsArray || resolvedType.fieldsArray.length !== 1) {
    return false;
  }
  return resolvedType.fieldsArray[0].type === 'bytes';
};
const isAddress = (resolvedType: any) => isWrappedBytes(resolvedType, 'Address');

const isHash = (resolvedType: any) => isWrappedBytes(resolvedType, 'Hash');
export function transformArrayToMap(inputType: any, origin: any[]) {
  if (!origin) return '';
  if (!Array.isArray(origin) || isAddress(inputType) || isHash(inputType)) return origin;

  const { fieldsArray } = inputType || {};
  const fieldsLength = (fieldsArray || []).length;

  if (fieldsLength === 0) return origin;

  if (fieldsLength === 1) {
    const i = fieldsArray[0];
    return { [i.name]: origin[0] };
  }

  let result = origin;
  Array.isArray(fieldsArray) &&
    Array.isArray(origin) &&
    fieldsArray.forEach((i, k) => {
      result = {
        ...result,
        [i.name]: origin[k],
      };
    });
  return result;
}

export function encodeProtoToBase64(protoJson: any, name: string, params: any) {
  const method: any = protobuf.Root.fromJSON(protoJson);
  const inputType = method[name];
  let input = AElf.utils.transform.transformMapToArray(inputType, params);
  input = AElf.utils.transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);
  const message = inputType.fromObject(input);
  return Buffer.from(inputType.encode(message).finish()).toString('base64');
}

export function decodeProtoBase64ToMap(base64Str: string, protoJson: any, name: string) {
  const method: any = protobuf.Root.fromJSON(protoJson);
  const inputType = method[name];
  let deserialize = inputType.decode(Buffer.from(base64Str, 'base64'));
  deserialize = inputType.toObject(deserialize, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true, // includes virtual oneof fields set to the present field's name
  });
  let deserializeLogResult = transform.transform(inputType, deserialize, transform.OUTPUT_TRANSFORMERS);
  deserializeLogResult = transform.transformArrayToMap(inputType, deserializeLogResult);
  return deserializeLogResult;
}

export const decodeAddress = (address: string) => {
  try {
    if (!address) return false;
    if (address.indexOf('_') > -1) {
      const info = store.getState().aelfInfo.aelfInfo;
      const parts = address.split('_');
      if (parts[0] === 'ELF' && parts[2] === info.curChain) {
        decodeAddressRep(parts[1]);
        return true;
      } else {
        return false;
      }
    } else {
      decodeAddressRep(address);
      return true;
    }
  } catch (error) {
    return false;
  }
};

export const decodeTransferAddress = (address: string) => {
  try {
    if (!address) return false;
    if (address.indexOf('_') > -1) {
      const info = store.getState().aelfInfo.aelfInfo;
      const parts = address.split('_');
      if ((parts[0] === 'ELF' && parts[2] === info.curChain) || parts[2] === SupportedELFChainId.MAIN_NET) {
        decodeAddressRep(parts[1]);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const encodedParams = (inputType: any, params: any) => {
  let input = transform.transformMapToArray(inputType, params);
  input = transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);
  const message = inputType.create(input);
  return inputType.encode(message).finish();
};
