import { USER_REJECTED } from 'constants/errorMessage';
import { IContractError } from 'types';

enum SourceErrorType {
  Error1 = 'BeanPass Balance is not enough',
  Error2 = 'PlayableCount is not enough',
  Error3 = 'Invalid input',
  Error4 = 'Bout not found',
  Error5 = 'Bout already finished',
  Error6 = 'Invalid target height',
  Error7 = 'Syncing on-chain account info',
  Error8 = 'You closed the prompt without any action',
  Error9 = 'Operation canceled',
  Error10 = 'User denied',
  Error11 = 'User close the prompt',
}
export enum TargetErrorType {
  Error1 = "You don't have any BeanPass NFTs in your account.",
  Error2 = 'Not enough GOs to start the game',
  Error3 = 'Invalid operation',
  Error4 = 'Invalid operation',
  Error5 = 'You have tried too many times',
  Error6 = 'Please try again later',
  Error7 = 'Syncing on-chain account info',
  Error8 = USER_REJECTED,
  Error9 = USER_REJECTED,
  Error10 = USER_REJECTED,
  Error11 = USER_REJECTED,
  Error12 = 'This BeanPass NFT is currently not in your account.',
  Default = 'Please check your internet connection and try again.',
}

const matchErrorMsg = <T>(message: T) => {
  if (typeof message === 'string') {
    const sourceErrors = [
      SourceErrorType.Error1,
      SourceErrorType.Error2,
      SourceErrorType.Error3,
      SourceErrorType.Error4,
      SourceErrorType.Error5,
      SourceErrorType.Error6,
      SourceErrorType.Error7,
      SourceErrorType.Error8,
      SourceErrorType.Error9,
      SourceErrorType.Error10,
      SourceErrorType.Error11,
    ];
    const targetErrors = [
      TargetErrorType.Error1,
      TargetErrorType.Error2,
      TargetErrorType.Error3,
      TargetErrorType.Error4,
      TargetErrorType.Error5,
      TargetErrorType.Error6,
      TargetErrorType.Error7,
      TargetErrorType.Error8,
      TargetErrorType.Error9,
      TargetErrorType.Error10,
      TargetErrorType.Error11,
    ];

    for (let index = 0; index < sourceErrors.length; index++) {
      if (message.includes(targetErrors[index])) {
        return message;
      }
      if (message.includes(sourceErrors[index])) {
        return message.replace(sourceErrors[index], targetErrors[index]);
      }
    }

    return TargetErrorType.Default;
  }
  return TargetErrorType.Default;
};

export const formatErrorMsg = (result: IContractError) => {
  let resError: IContractError = result;

  if (result?.message) {
    resError = {
      ...result,
      error: result?.code,
      errorMessage: {
        message: result.message,
      },
    };
  } else if (result?.Error) {
    resError = {
      ...result,
      error: '401',
      errorMessage: {
        message: JSON.stringify(result.Error).replace('AElf.Sdk.CSharp.AssertionException: ', ''),
      },
    };
  } else if (typeof result?.error !== 'number' && typeof result?.error !== 'string') {
    if (result?.error?.message) {
      resError = {
        ...result,
        error: '401',
        errorMessage: {
          message: JSON.stringify(result.error.message).replace('AElf.Sdk.CSharp.AssertionException: ', ''),
        },
      };
    }
  }

  const errorMessage = resError?.errorMessage?.message;

  return {
    ...resError,
    errorMessage: {
      message: matchErrorMsg(errorMessage),
    },
  };
};
