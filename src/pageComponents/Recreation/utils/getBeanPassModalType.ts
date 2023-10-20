import { getBeanPassClaimClaimable } from 'api/request';
import { GetBeanPassStatus } from 'components/CommonModal/type';
import { store } from 'redux/store';
import { BeanPassResons } from 'types';
import showMessage from 'utils/setGlobalComponentsInfo';

interface IProps {
  address: string;
  doubleClaimCallback?: () => void;
}

export const getBeanPassModalType = async ({ address, doubleClaimCallback }: IProps) => {
  const open = store.getState().noticeModal.noticeModal?.open;
  let beanPassClaimClaimableRes;
  let beanPassModalType = GetBeanPassStatus.Abled;
  try {
    beanPassClaimClaimableRes = await getBeanPassClaimClaimable({
      caAddress: address,
    });
    console.log('BeanPassClaimClaimableRes', beanPassClaimClaimableRes);
    showMessage.hideLoading();
  } catch (err) {
    showMessage.hideLoading();
    console.log('checkBeanPassStatusError:', err);
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
