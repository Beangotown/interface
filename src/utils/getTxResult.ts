import AElf from 'aelf-sdk';
import { sleep } from './common';
import { TargetErrorType } from './formattError';
import { Severity, captureMessage } from './captureMessage';

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
      type: 'http',
      params: {
        name: 'getTxResult',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        info: txResult,
      },
    });
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    captureMessage({
      type: 'http',
      params: {
        name: 'getTxResult',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        info: txResult,
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
      type: 'http',
      params: {
        name: 'getTxResult',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        info: txResult,
      },
      level: Severity.Info,
    });
    return getTxResult(TransactionId, chainId, reGetCount, rpcUrl, reNotexistedCount);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return { TransactionId, txResult };
  }
  captureMessage({
    type: 'http',
    params: {
      name: 'getTxResult',
      method: 'get',
      query: {
        TransactionId,
        rpcUrl,
      },
      info: txResult,
    },
  });
  throw Error(TargetErrorType.Default);
}

export async function getTxResultOnce(TransactionId: string, rpcUrl: string): Promise<any> {
  const txResult = await getAElf(rpcUrl).chain.getTxResult(TransactionId);
  if (txResult.error && txResult.errorMessage) {
    captureMessage({
      type: 'http',
      params: {
        name: 'getTxResultOnce',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        info: txResult,
      },
    });
    throw Error(txResult.errorMessage.message || txResult.errorMessage.Message);
  }

  if (!txResult) {
    captureMessage({
      type: 'http',
      params: {
        name: 'getTxResultOnce',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        info: txResult,
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
      type: 'http',
      params: {
        name: 'getTxResultOnce',
        method: 'get',
        query: {
          TransactionId,
          rpcUrl,
        },
        info: txResult,
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
    type: 'http',
    params: {
      name: 'getTxResultOnce',
      method: 'get',
      query: {
        TransactionId,
        rpcUrl,
      },
      info: txResult,
    },
  });
  throw Error(TargetErrorType.Default);
}
