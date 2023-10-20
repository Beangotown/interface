import { IDIDWalletInfo } from 'types';
import getAccountInfoSync from './getAccountInfoSync';
import { trackUnlockInfo as trackUnlockInfoApi } from 'api/request';
import { SentryMessageType, captureMessage } from './captureMessage';

export const getSyncHolder = async (chainId: string, didWalletInfo?: Partial<IDIDWalletInfo>) => {
  const { holder } = await getAccountInfoSync(chainId, didWalletInfo);
  return holder;
};

export const trackLoginInfo = async ({ caAddress, caHash }: { caAddress: string; caHash: string }) => {
  try {
    const res = await trackUnlockInfoApi({ caAddress, caHash });
  } catch (err) {
    captureMessage({
      type: SentryMessageType.HTTP,
      params: {
        name: 'trackLoginInfo',
        method: 'post',
        query: { caAddress, caHash },
        description: err,
      },
    });
  }
};
