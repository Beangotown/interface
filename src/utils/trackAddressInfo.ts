import { IDIDWalletInfo } from 'types';
import getAccountInfoSync from './getAccountInfoSync';
import { trackUnlockInfo as trackUnlockInfoApi } from 'api/request';

export const getSyncHolder = async (chainId: string, didWalletInfo?: Partial<IDIDWalletInfo>) => {
  const { holder } = await getAccountInfoSync(chainId, didWalletInfo);
  return holder;
};

export const trackLoginInfo = async ({ caAddress, caHash }: { caAddress: string; caHash: string }) => {
  const res = await trackUnlockInfoApi({ caAddress, caHash });
  console.log('trackUnlockInfo', res);
};
