import { DEFAULT_ERROR } from 'constants/errorMessage';
import { IContractError } from './type';

enum SourceErrorType {
  Error1 = 'Operation canceled',
  Error2 = 'You closed the prompt without any action',
  Error3 = 'User denied',
  Error4 = 'User close the prompt',
  Error5 = 'Wallet not login',
  Error6 = 'Insufficient allowance of ELF',
  Error7 = 'User Cancel',
}

export const cancelListingMessage =
  'All your NFTs are now listed. Please cancel the listings before initiating a new listing.';

export enum TargetErrorType {
  Error1 = 'Request rejected. Forest needs your permission to continue',
  Error2 = 'Request rejected. Forest needs your permission to continue',
  Error3 = 'Request rejected. Forest needs your permission to continue',
  Error4 = 'Request rejected. Forest needs your permission to continue',
  Error5 = 'Wallet not logged in',
  Error6 = 'The allowance you set is less than required. Please reset it',
  Error7 = 'Request rejected. Forest needs your permission to continue',
}

export const matchErrorMsg = <T>(message: T, method?: string) => {
  // console.log('errorMsg', message);
  if (typeof message === 'string') {
    const sourceErrors = [
      SourceErrorType.Error1,
      SourceErrorType.Error2,
      SourceErrorType.Error3,
      SourceErrorType.Error4,
      SourceErrorType.Error5,
      SourceErrorType.Error6,
      SourceErrorType.Error7,
    ];
    const targetErrors = [
      TargetErrorType.Error1,
      TargetErrorType.Error2,
      TargetErrorType.Error3,
      TargetErrorType.Error4,
      TargetErrorType.Error5,
      TargetErrorType.Error6,
      TargetErrorType.Error7,
    ];

    let resMessage: string = message;

    if (message.includes('Insufficient allowance. Token')) {
      const symbol = message.split('Token: ')?.[1].split(';')?.[0];
      switch (method) {
        case 'BatchBuyNow':
        case 'MakeOffer':
          resMessage = `Operation failed. The seller's allowance for ${symbol} is insufficient. You can wait for the seller to reset allowance or explore other NFTs you like.`;
          break;
        case 'Deal':
          resMessage = `Operation failed. The buyer's allowance for ${symbol} is insufficient. You can wait for the buyer to reset allowance or explore other offers to accept.`;
          break;
        case 'PlaceBid':
          resMessage = `${TargetErrorType.Error6}.`;
          break;
        default:
          resMessage = message;
          break;
      }
      return resMessage;
    }

    for (let index = 0; index < sourceErrors.length; index++) {
      if (message.includes(sourceErrors[index])) {
        resMessage = message.replace(sourceErrors[index], targetErrors[index]);
      }
    }

    return resMessage.replace('AElf.Sdk.CSharp.AssertionException: ', '');
  } else {
    return DEFAULT_ERROR;
  }
};

export const formatErrorMsg = (result: IContractError, method?: string) => {
  let resError: IContractError = result;

  if (result.message) {
    resError = {
      ...result,
      error: result.code,
      errorMessage: {
        message: JSON.stringify(result.message),
      },
    };
  } else if (result.Error) {
    resError = {
      ...result,
      error: '401',
      errorMessage: {
        message: JSON.stringify(result.Error).replace('AElf.Sdk.CSharp.AssertionException: ', ''),
      },
    };
  } else if (typeof result.error !== 'number' && typeof result.error !== 'string') {
    if (result.error?.message) {
      resError = {
        ...result,
        error: '401',
        errorMessage: {
          message: JSON.stringify(result.error.message).replace('AElf.Sdk.CSharp.AssertionException: ', ''),
        },
      };
    }
  } else if (typeof result.error === 'string') {
    resError = {
      ...result,
      error: '401',
      errorMessage: {
        message: result?.errorMessage?.message || result.error,
      },
    };
  }

  const errorMessage = resError.errorMessage?.message;

  return {
    ...resError,
    errorMessage: {
      message: matchErrorMsg(errorMessage, method),
    },
  };
};
