import AElf from 'aelf-sdk';
import { sleep } from './common';
import { TargetErrorType } from './formattError';
import { SentryMessageType, Severity, captureMessage } from './captureMessage';

export interface ITxResultProps {
  TransactionId: string;
  chainId: Chain;
  rePendingEnd?: number;
  rpcUrl: string;
  reNotexistedCount?: number;
  reGetCount?: number;
}

export function getAElf(rpcUrl?: string) {
  const rpc = rpcUrl || '';
  const httpProviders: any = {};

  if (!httpProviders[rpc]) {
    httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  }
  return httpProviders[rpc];
}

export async function getTxResult(
  TransactionId: string,
  chainId: Chain,
  reGetCount = 0,
  rpcUrl: string,
  reNotexistedCount = 3,
): Promise<any> {
  const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'getTxResult',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        description: txResult,
      },
    });
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'getTxResult',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        description: 'no txResult',
      },
    });
    throw Error(TargetErrorType.Default);
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    reGetCount++;
    await sleep(500);
    return getTxResult(TransactionId, chainId, reGetCount, rpcUrl, reNotexistedCount);
  }

  if (txResult.Status.toLowerCase() === 'notexisted' && reNotexistedCount) {
    await sleep(500);
    reNotexistedCount--;
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'getTxResult',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        description: {
          txResult,
          reNotexistedCount,
        },
      },
      level: Severity.Info,
    });
    return getTxResult(TransactionId, chainId, reGetCount, rpcUrl, reNotexistedCount);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return { TransactionId, txResult };
  }
  captureMessage({
    type: SentryMessageType.HTTP,
    params: {
      name: 'getTxResult',
      method: 'get',
      query: {
        TransactionId,
        rpcUrl,
      },
      description: txResult,
    },
  });
  throw Error(TargetErrorType.Default);
}

export async function getTxResultRetry({
  TransactionId,
  chainId,
  rpcUrl,
  reGetCount = 3,
  rePendingEnd,
  reNotexistedCount = 3,
}: ITxResultProps): Promise<any> {
  try {
    const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
    if (txResult.error && txResult.errorMessage) {
      throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
    }

    if (!txResult) {
      if (reGetCount > 1) {
        await sleep(500);
        reGetCount--;
        return getTxResultRetry({
          TransactionId,
          chainId,
          rePendingEnd,
          rpcUrl,
          reNotexistedCount,
          reGetCount,
        });
      }
      throw Error(TargetErrorType.Default);
    }

    if (txResult.Status.toLowerCase() === 'pending') {
      const current = new Date().getTime();
      console.log('=====time', rePendingEnd, current);
      if (rePendingEnd && rePendingEnd <= current) {
        throw Error(TargetErrorType.Default);
      }
      await sleep(500);
      const pendingEnd = rePendingEnd || current;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd: pendingEnd,
        rpcUrl,
        reNotexistedCount,
        reGetCount,
      });
    }

    if (txResult.Status.toLowerCase() === 'notexisted' && reNotexistedCount > 1) {
      await sleep(500);
      reNotexistedCount--;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd,
        rpcUrl,
        reNotexistedCount,
        reGetCount,
      });
    }

    if (txResult.Status.toLowerCase() === 'mined') {
      return { TransactionId, txResult };
    }
    throw Error(TargetErrorType.Default);
  } catch (error) {
    console.log('=====getTxResult error', error);
    if (reGetCount > 1) {
      await sleep(500);
      reGetCount--;
      return getTxResultRetry({
        TransactionId,
        chainId,
        rePendingEnd,
        rpcUrl,
        reNotexistedCount,
        reGetCount,
      });
    }
    throw Error(TargetErrorType.Default);
  }
}

export async function getTxResultOnce(TransactionId: string, rpcUrl: string): Promise<any> {
  const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'getTxResultOnce',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        description: txResult,
      },
    });
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'getTxResultOnce',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        description: 'no txResult',
      },
    });
    throw Error(TargetErrorType.Default);
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    return {
      status: 'pending',
      TransactionId,
      txResult,
    };
  }

  if (txResult.Status.toLowerCase() === 'notexisted') {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'getTxResultOnce',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        description: txResult,
      },
      level: Severity.Info,
    });
    return {
      status: 'notexisted',
      TransactionId,
      txResult,
    };
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return { TransactionId, txResult };
  }

  captureMessage({
    type: SentryMessageType.HTTP,
    params: {
      name: 'getTxResultOnce',
      method: 'get',
      query: {
        TransactionId,
        rpcUrl,
      },
      description: txResult,
    },
  });
  throw Error(TargetErrorType.Default);
}
