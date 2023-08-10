import {
  useSignHandler,
  DIDWalletInfo,
  IGuardianIdentifierInfo,
  TStep1LifeCycle,
  TStep2SignInLifeCycle,
  socialLoginAuth,
  SignIn,
  did,
  ConfigProvider,
  Unlock,
} from '@portkey/did-ui-react';
import { Button, Drawer, Modal, Image, Input } from 'antd';
import detectProvider from '@portkey/detect-provider';
import { isMobileDevices } from 'utils/isMobile';
import { IPortkeyProvider } from '@portkey/provider-types';
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { setAccountInfoSync, setDiscoverInfo, setLoginStatus, setWalletInfo } from 'redux/reducer/info';
import { store } from 'redux/store';
import { LoginStatus } from 'redux/types/reducerTypes';
import getAccountInfoSync from 'utils/getAccountInfoSync';
import isMobile from 'utils/isMobile';
import isPortkeyApp from 'utils/inPortkeyApp';
import { Network, ChainId, portKeyExtensionUrl } from 'constants/platform';
import { SignInDesignType, SocialLoginType, AccountsType } from 'types/index';
import useLogin from 'hooks/useLogin';
import { Store } from 'utils/store';
import styles from './style.module.css';
import { useRouter } from 'next/navigation';
import { useDebounceFn } from 'ahooks';
import openPageInDiscover from 'utils/openDiscoverPage';

const KEY_NAME = 'BEANGOTOWN';

export default function Login() {
  const signInRef = useRef<{ setOpen: Function }>(null);

  const [style, setStyle] = useState<string>(styles.inputForm);

  const [design, setDesign] = useState<SignInDesignType>('Web2Design');

  const [currentLifeCircle, setCurrentLifeCircle] = useState<TStep2SignInLifeCycle | TStep1LifeCycle>({
    LoginByScan: undefined,
  });

  const isInAndroid = isMobile().android.device;

  const { isLock, isLogin } = useLogin();

  const router = useRouter();

  const isInIOS = isMobile().apple.device;

  const isInApp = isPortkeyApp();

  const [isWalletExist, setIsWalletExist] = useState(false);

  const handleSocialStep1Success = (value: IGuardianIdentifierInfo) => {
    setCurrentLifeCircle({
      GuardianApproval: {
        guardianIdentifierInfo: {
          chainId: value.chainId,
          isLoginGuardian: value.isLoginGuardian,
          identifier: value.identifier,
          accountType: value.accountType,
        },
      },
    });
    setTimeout(() => {
      signInRef.current?.setOpen(true);
    }, 500);
  };

  const signHandle = useSignHandler({
    onSuccess: handleSocialStep1Success,
    defaultChainId: ChainId,
    customValidateEmail: undefined,
    customValidatePhone: undefined,
    onChainIdChange: undefined,
    onError: undefined,
  });

  const handleGoogle = async () => {
    setVisible(false);
    const res = await getSocialToken({ type: 'Google' });
    await signHandle.onSocialFinish({
      type: res.provider,
      data: { accessToken: res.token },
    });
  };

  const handleApple = async () => {
    setVisible(false);
    const res = await getSocialToken({ type: 'Apple' });
    await signHandle.onSocialFinish({
      type: res.provider,
      data: { accessToken: res.token },
    });
  };

  const getSocialToken = async ({
    type,
    clientId = '',
    redirectURI = '',
  }: {
    type: SocialLoginType;
    clientId?: string;
    redirectURI?: string;
  }) => {
    const tokenRes = await socialLoginAuth({
      type,
      clientId,
      redirectURI,
    });
    return tokenRes;
  };

  const { run: handlePortKey } = useDebounceFn(
    async () => {
      if (isMobileDevices() && !isInApp) {
        openPageInDiscover();
        return;
      }
      if (!window?.portkey && !isMobileDevices()) {
        window?.open(portKeyExtensionUrl, '_blank')?.focus();
        return;
      }
      const provider: IPortkeyProvider | null = await detectProvider();
      if (!provider) {
        console.log('unknow');
        return;
      }
      const network = await provider?.request({ method: 'network' });
      if (network !== Network) {
        console.log('network error');
        return;
      }
      let accounts = await provider?.request({ method: 'accounts' });
      if (accounts[ChainId] && accounts[ChainId].length > 0) {
        onAccountsSuccess(provider, accounts);
        store.dispatch(setLoginStatus(LoginStatus.LOGGED));
        return;
      }
      accounts = await provider?.request({ method: 'requestAccounts' });
      if (accounts[ChainId] && accounts[ChainId].length > 0) {
        onAccountsSuccess(provider, accounts);
        store.dispatch(setLoginStatus(LoginStatus.LOGGED));
      } else {
        console.log('account error');
      }
    },
    {
      wait: 500,
      maxWait: 500,
      leading: true,
      trailing: false,
    },
  );

  const onAccountsSuccess = useCallback(async (provider: IPortkeyProvider, accounts: AccountsType) => {
    let nickName = 'Wallet 01';
    const address = accounts[ChainId]?.[0].split('_')[1];
    try {
      nickName = await provider.request({ method: 'wallet_getWalletName' });
    } catch (error) {
      console.warn(error);
    }
    // localStorage.setItem(LOGIN_EARGLY_KEY, "true");

    store.dispatch(
      setDiscoverInfo({
        address,
        accounts,
        nickName,
        provider,
      }),
    );
    router.push('/');
  }, []);

  useEffect(() => {
    ConfigProvider.setGlobalConfig({
      storageMethod: new Store(),
      requestDefaults: {
        baseURL: '/portkey',
      },
    });
    if (typeof window !== undefined && window.localStorage.getItem(KEY_NAME)) {
      setIsWalletExist(true);
    }
  }, []);

  const handleEmail = () => {
    setVisible(false);
    setStyle(styles.inputForm);
    setDesign('Web2Design');
    setCurrentLifeCircle({ LoginByScan: undefined });
    signInRef.current?.setOpen(true);
    setTimeout(() => {
      (document.getElementsByClassName('portkey-ant-segmented-item')?.[1] as HTMLElement)?.click();
    }, 1000);
  };

  const handlePhone = () => {
    setVisible(false);
    setStyle(styles.inputForm);
    setDesign('Web2Design');
    setCurrentLifeCircle({ LoginByScan: undefined });
    signInRef.current?.setOpen(true);
  };

  const handleQrcode = () => {
    setVisible(false);
    setStyle(styles.qrcodeBox);
    setDesign('SocialDesign');
    setCurrentLifeCircle({ LoginByScan: undefined });
    signInRef.current?.setOpen(true);
  };

  const handleFinish = async (wallet: DIDWalletInfo) => {
    console.log('wallet', wallet);
    store.dispatch(setWalletInfo(wallet));
    store.dispatch(setLoginStatus(LoginStatus.LOGGED));
    did.save(wallet.pin, KEY_NAME);
    const accountInfoSync = await getAccountInfoSync(ChainId, wallet);
    console.log(accountInfoSync);
    store.dispatch(setAccountInfoSync(accountInfoSync));
    router.push('/');
  };

  const [visible, setVisible] = useState(false);

  const [isUnlockShow, setIsUnlockShow] = useState(false);

  const [passwordValue, setPasswordValue] = useState('');

  const [isErrorTipShow, setIsErrorTipShow] = useState(false);

  const renderLoginMethods = (inModel: boolean) => {
    const allMethods = [
      { name: 'Login with Google', onclick: handleGoogle },
      { name: 'Login with Apple', onclick: handleApple },
      { name: 'Login with Portkey', onclick: handlePortKey },
      { name: 'Login with Email', onclick: handleEmail },
      { name: 'Login with Phone', onclick: handlePhone },
      { name: 'Login with QR code', onclick: handleQrcode },
    ];
    let filterMethods: Array<{ name: string; onclick: MouseEventHandler<HTMLDivElement> }> = [];
    if (isInApp) {
      filterMethods = [allMethods[2]];
    } else if (isInIOS) {
      filterMethods = inModel ? [allMethods[0], ...allMethods.slice(3, 6)] : [allMethods[1], allMethods[2]];
    } else {
      filterMethods = inModel ? [allMethods[1], ...allMethods.slice(3, 6)] : [allMethods[0], allMethods[2]];
    }
    return filterMethods.map((item, index) => (
      <div key={index} onClick={item.onclick} className={styles.loginBtn}>
        {item.name}
      </div>
    ));
  };

  const unlock = useCallback(async () => {
    setIsUnlockShow(true);
    let wallet;
    try {
      wallet = await did.load(passwordValue, KEY_NAME);
    } catch (err) {
      console.log(err);
      return;
    }
    console.log('wallet', wallet);
    if (!wallet.didWallet.accountInfo.loginAccount) {
      setIsErrorTipShow(true);
      return;
    }
    const updateWallet = {
      caInfo: { ...wallet.didWallet.caInfo[ChainId] },
      pin: '',
      walletInfo: wallet.didWallet.managementAccount,
    };
    store.dispatch(setWalletInfo(updateWallet));
    setIsUnlockShow(false);
    store.dispatch(setLoginStatus(LoginStatus.LOGGED));
    router.push('/');
  }, [passwordValue, router]);

  return (
    <div className={styles.loadingContainer}>
      {isWalletExist ? (
        <Button onClick={unlock}>unLock</Button>
      ) : (
        <>
          {renderLoginMethods(false)}
          {!isInApp && (
            <div
              className={styles.more}
              onClick={() => {
                setVisible(true);
              }}>
              More
            </div>
          )}
        </>
      )}

      <Drawer
        open={visible}
        placement={'bottom'}
        className={styles.loginMethodDrawer}
        onClose={() => {
          setVisible(false);
        }}
        maskClosable={true}>
        <div className={styles.drawerHeader}>Login method</div>
        {renderLoginMethods(true)}
      </Drawer>

      <SignIn
        ref={signInRef}
        design={design}
        defaultLifeCycle={currentLifeCircle}
        className={style}
        onFinish={handleFinish}
      />

      <Unlock
        onUnlock={unlock}
        open={isUnlockShow}
        onCancel={() => {
          setIsUnlockShow(false);
        }}
        value={passwordValue}
        onChange={(v) => {
          setIsErrorTipShow(false);
          setPasswordValue(v);
        }}
        isWrongPassword={true}
      />
    </div>
  );
}
