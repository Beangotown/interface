import { Asset, PortkeyAssetProvider } from '@portkey/did-ui-react';
import { KEY_NAME, PORTKEY_LOGIN_CHAIN_ID_KEY } from 'constants/platform';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useGetState from 'redux/state/useGetState';
import { WalletType } from 'types';
import { LeftOutlined } from '@ant-design/icons';
import styles from './style.module.css';

export default function MyAsset() {
  const router = useRouter();
  const { walletInfo, walletType, isLogin, configInfo } = useGetState();
  const { isShowRampBuy, isShowRampSell } = configInfo!;
  useEffect(() => {
    if (!isLogin) {
      router.push('/login');
    } else if (walletType !== WalletType.portkey) {
      router.push('/');
    }
  }, [isLogin, router, walletType]);

  const originChainId = localStorage.getItem(PORTKEY_LOGIN_CHAIN_ID_KEY) || '';
  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider
        originChainId={originChainId as Chain}
        pin={walletInfo?.portkeyInfo?.pin}
        caHash={walletInfo?.portkeyInfo?.caInfo?.caHash}
        didStorageKeyName={KEY_NAME}>
        <Asset
          isShowRamp={isShowRampBuy || isShowRampSell}
          isShowRampBuy={isShowRampBuy}
          isShowRampSell={isShowRampSell}
          faucet={{
            faucetContractAddress: configInfo?.faucetContractAddress,
          }}
          backIcon={<LeftOutlined />}
          onOverviewBack={() => router.back()}
          onLifeCycleChange={(lifeCycle) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
