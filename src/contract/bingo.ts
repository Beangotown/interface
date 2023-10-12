import { IBoutInformation, IContractError, IGameSetting, IPlayerInformation, IPlayerProps } from 'types';
import contractRequest from './contractRequest';
import { formatErrorMsg } from 'utils/formattError';
import { store } from 'redux/store';
import { sleep } from 'utils/common';
const { configInfo } = store.getState();

export enum ContractMethodType {
  SEND,
  VIEW,
}

const bingoContract = async <T, R>(methodName: string, params: T, type: ContractMethodType) => {
  const contract = contractRequest.get();
  const contractAddress = configInfo.configInfo!.bingoContractAddress;
  const method = type === ContractMethodType.SEND ? 'callSendMethod' : 'callViewMethod';
  try {
    const res = await contract[method]({
      methodName,
      contractAddress,
      args: params,
    });

    return res as R;
  } catch (error) {
    const resError = error as IContractError;
    console.error('=====bingoContract', resError);
    return Promise.reject(formatErrorMsg(resError));
  }
};

export const CheckBeanPass = async (address: string): Promise<{ value: boolean } | IContractError> => {
  return await bingoContract('CheckBeanPass', address, ContractMethodType.VIEW);
};

export const GetPlayerInformation = async (address: string): Promise<IPlayerInformation> => {
  return await bingoContract('GetPlayerInformation', address, ContractMethodType.VIEW);
};

export const GetGameLimitSettings = async (): Promise<IGameSetting> => {
  return await bingoContract('GetGameLimitSettings', null, ContractMethodType.VIEW);
};

export const GetBoutInformation = async (playId: string, count = 2): Promise<IBoutInformation> => {
  try {
    const res: IBoutInformation = await bingoContract(
      'GetBoutInformation',
      {
        playId,
      },
      ContractMethodType.VIEW,
    );

    if (count && (res.score === 0 || res.gridNum === 0)) {
      await sleep(500);
      await GetBoutInformation(playId, --count);
    } else {
      return res;
    }
  } catch (error) {
    if (count) {
      await sleep(500);
      await GetBoutInformation(playId, --count);
    }
  }
};

export const BingoNew = async ({
  resetStart,
  diceCount,
}: IPlayerProps): Promise<{ TransactionId: string; TxResult: any }> => {
  try {
    const res = (await bingoContract('BingoNew', { resetStart, diceCount }, ContractMethodType.SEND)) as {
      TransactionId: string;
      TransactionResult: any;
    };
    console.log('=====BingoNew result', res);
    return {
      TransactionId: res?.TransactionId,
      TxResult: res?.TransactionResult,
    };
  } catch (error) {
    console.log('=====BingoNew error', error);
    return Promise.reject(error);
  }
};

export const GetBingoReward = async (params: IPlayerProps): Promise<IBoutInformation> => {
  try {
    const { TransactionId } = await BingoNew(params);
    const rewardRes = await GetBoutInformation(TransactionId);
    if (rewardRes) {
      return rewardRes;
    }
    return Promise.reject();
  } catch (error) {
    return Promise.reject(error);
  }
};
