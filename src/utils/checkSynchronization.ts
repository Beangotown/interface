import ContractRequest from 'contract/contractRequest';
import { store } from 'redux/store';

const checkSynchronization = async (message: string) => {
  const { info } = store.getState();
  if (info.walletType === 'discover' && message.includes('Pre-Error: Transaction fee not enough.')) {
    try {
      const rst = await ContractRequest.get().getSyncChainStatus();
      return rst;
    } catch (error) {
      return true;
    }
  }
  return true;
};

export default checkSynchronization;
