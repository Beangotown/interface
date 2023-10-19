import { getBeanPassClaimClaimable } from 'api/request';
import { GetBeanPassStatus } from 'components/CommonModal/type';
import { BeanPassResons } from 'types';
import showMessage from 'utils/setGlobalComponentsInfo';

interface IProps {
  address: string;
}

export const getBeanPassModalType = async ({ address }: IProps) => {
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
    }
  }

  return beanPassModalType;
};
