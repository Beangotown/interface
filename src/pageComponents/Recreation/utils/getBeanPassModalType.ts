import { getBeanPassClaimClaimable } from 'api/request';
import { GetBeanPassStatus } from 'components/CommonModal/type';
import { BeanPassResons } from 'types';
import showMessage from 'utils/setGlobalComponentsInfo';

interface IProps {
  address: string;
}

export const getBeanPassModalType = async ({ address }: IProps) => {
  let beanPassClaimClaimableRes;
  let beanPassModalType = undefined;
  try {
    beanPassClaimClaimableRes = await getBeanPassClaimClaimable({
      caAddress: address,
    });
    console.log('BeanPassClaimClaimableRes', beanPassClaimClaimableRes);
    showMessage.hideLoading();
  } catch (err) {
    showMessage.hideLoading();
    console.log('checkBeanPassStatusError:', err);
    return;
  }
  if (!beanPassClaimClaimableRes) return;
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
