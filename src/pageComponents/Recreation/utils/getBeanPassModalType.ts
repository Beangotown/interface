import { getBeanPassClaimClaimable } from 'api/request';
import { GetBeanPassStatus } from 'components/CommonModal/type';
import { store } from 'redux/store';
import { BeanPassResons } from 'types';
import { sleep } from 'utils/common';
import showMessage from 'utils/setGlobalComponentsInfo';

interface IProps {
  address: string;
  reTryCounts?: number;
  doubleClaimCallback?: () => void;
}

export const getBeanPassModalType: (params: IProps) => Promise<false | GetBeanPassStatus> = async ({
  address,
  reTryCounts,
  doubleClaimCallback,
}: IProps) => {
  const open = store.getState().noticeModal.noticeModal?.open;
  let beanPassClaimClaimableRes;
  let beanPassModalType = GetBeanPassStatus.Abled;
  try {
    beanPassClaimClaimableRes = await getBeanPassClaimClaimable({
      caAddress: address,
    });
    if (beanPassClaimClaimableRes?.code === '20002') {
      if (reTryCounts) {
        await sleep(1000);
        return getBeanPassModalType({
          address,
          reTryCounts: --reTryCounts,
        });
      } else {
        showMessage.hideLoading();
        showMessage.error(beanPassClaimClaimableRes.message);
        return false;
      }
    }
    showMessage.hideLoading();
  } catch (err) {
    showMessage.hideLoading();
    return false;
  }
  if (!beanPassClaimClaimableRes) return false;
  const { claimable, reason } = beanPassClaimClaimableRes;

  if (claimable) {
    beanPassModalType = GetBeanPassStatus.Abled;
  } else {
    if (reason === BeanPassResons.Claimed) {
      beanPassModalType = GetBeanPassStatus.Noneleft;
    } else if (reason === BeanPassResons.InsufficientElfAmount) {
      beanPassModalType = GetBeanPassStatus.Recharge;
    } else if (reason === BeanPassResons.DoubleClaim) {
      beanPassModalType = GetBeanPassStatus.Notfound;
      if (open) {
        doubleClaimCallback && doubleClaimCallback();
        return false;
      }
    }
  }

  return beanPassModalType;
};
