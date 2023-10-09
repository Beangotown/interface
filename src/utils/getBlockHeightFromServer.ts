import { blockHeight } from 'api/request';
import { sleep } from './common';
import { TargetErrorType } from './formattError';

export async function getBlockHeightFromServer(expectedBlockHeight: number): Promise<boolean> {
  try {
    const blockResult = await blockHeight();
    if (!blockResult) {
      throw Error(TargetErrorType.Default);
    }
    if (blockResult < expectedBlockHeight) {
      await sleep(200);
      return getBlockHeightFromServer(expectedBlockHeight);
    } else {
      return true;
    }
  } catch (error) {
    throw Error(TargetErrorType.Default);
  }
}
