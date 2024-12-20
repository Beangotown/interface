'use client';
import {
  useSignHandler,
  DIDWalletInfo,
  IGuardianIdentifierInfo,
  TStep1LifeCycle,
  TStep2SignInLifeCycle,
  SignIn,
  did,
  Unlock,
  TStep3LifeCycle,
  TStep2SignUpLifeCycle,
  handleErrorMessage,
  errorTip,
  setLoading,
  TelegramPlatform,
  useLoginWallet,
  AddManagerType,
  useSignInHandler,
} from '@portkey/did-ui-react';
import { Drawer, Modal } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { setLoginStatus } from 'redux/reducer/info';
import { LoginStatus } from 'redux/types/reducerTypes';
import isMobile, { isMobileDevices } from 'utils/isMobile';
import isPortkeyApp from 'utils/inPortkeyApp';
import { LOGIN_EARGLY_KEY, PORTKEY_LOGIN_CHAIN_ID_KEY } from 'constants/platform';
import { SignInDesignType, SocialLoginType, OperationTypeEnum, TSignUpVerifier } from 'types/index';
import styles from './style.module.css';
import { useRouter } from 'next/navigation';
import { sleep } from 'utils/common';
import useVerifier from 'hooks/useVarified';
import { WalletType } from 'constants/index';
import {
  PortkeyIcon,
  AppleIcon,
  QrCodeIcon,
  PhoneIcon,
  EmailIcon,
  GoogleIcon,
  TelegramIcon,
} from 'assets/images/index';
import { CloseIcon } from 'assets/images/index';
import useWebLogin from 'hooks/useWebLogin';
import { KEY_NAME } from 'constants/platform';
import { DEFAULT_PIN } from 'constants/login';
import useGetState from 'redux/state/useGetState';
import { ChainId } from '@portkey/types';
import showMessage from 'utils/setGlobalComponentsInfo';
import { Proto } from 'utils/proto';
import { getProto } from 'utils/deserializeLog';
import discoverUtils from 'utils/discoverUtils';

const components = {
  phone: PhoneIcon,
  email: EmailIcon,
  apple: AppleIcon,
  portkey: PortkeyIcon,
  qrcode: QrCodeIcon,
  google: GoogleIcon,
  telegram: TelegramIcon,
};

type IconType = 'apple' | 'google' | 'portkey' | 'email' | 'phone' | 'qrcode' | 'telegram';

interface IAuthenticationInfo {
  googleAccessToken?: string;
  appleIdToken?: string;
}

export default function Login() {
  const signInRef = useRef<{ setOpen: Function }>(null);
  const isGettingTelegramAuthRef = useRef(false);

  const [style, setStyle] = useState<string>(styles.inputForm);

  const [design, setDesign] = useState<SignInDesignType>('Web2Design');

  const { configInfo, imageResources } = useGetState();
  const { curChain } = configInfo!;

  const [currentLifeCircle, setCurrentLifeCircle] = useState<
    TStep2SignInLifeCycle | TStep1LifeCycle | TStep3LifeCycle | TStep2SignUpLifeCycle
  >({});

  const onSignInHandler = useSignInHandler({ isErrorTip: true });
  const handleSocialStep1Success = async (value: IGuardianIdentifierInfo) => {
    setDrawerVisible(false);
    setModalVisible(false);
    if (!did.didWallet.managementAccount) did.create();
    if (!value.isLoginGuardian) {
      await onSignUp(value as IGuardianIdentifierInfo);
    } else {
      const signResult = await onSignInHandler(value);
      if (!signResult) return;
      if (signResult.nextStep === 'SetPinAndAddManager' && TelegramPlatform.isTelegramPlatform()) {
        const guardianIdentifierInfo = signResult.value.guardianIdentifierInfo;
        const approvedList = signResult.value.approvedList;
        if (!approvedList) return;
        const type: AddManagerType = guardianIdentifierInfo?.isLoginGuardian ? 'recovery' : 'register';
        const params = {
          pin: DEFAULT_PIN,
          type,
          chainId: guardianIdentifierInfo.chainId,
          accountType: guardianIdentifierInfo.accountType,
          guardianIdentifier: guardianIdentifierInfo?.identifier,
          guardianApprovedList: approvedList,
        };
        const didWallet = await createWallet(params);
        didWallet && handlePortKeyLoginFinish(didWallet);
      } else {
        setLoading(false);
        setCurrentLifeCircle({
          [signResult.nextStep as any]: signResult.value,
        });
        setTimeout(() => {
          signInRef.current?.setOpen(true);
        }, 500);
      }
    }
  };

  const signHandle = useSignHandler({
    onSuccess: handleSocialStep1Success,
    defaultChainId: curChain,
    customValidateEmail: undefined,
    customValidatePhone: undefined,
    onChainIdChange: undefined,
    onError: undefined,
  });

  const { handlePortKey, handleFinish, handleApple, handleGoogle, handleTeleGram, loginEagerly } = useWebLogin({
    signHandle,
  });

  const createWallet = useLoginWallet();

  const { isLock, isLogin, isMobile: isMobileStore } = useGetState();

  const router = useRouter();

  useEffect(() => {
    if (isLogin) {
      router.replace('/');
    }
  }, [isLogin, router]);

  const isInIOS = isMobile().apple.device;

  const isInApp = isPortkeyApp();

  const [_isWalletExist, setIsWalletExist] = useState(false);

  useEffect(() => {
    if (isLock || isGettingTelegramAuthRef.current) {
      return;
    }
    if (typeof window !== undefined) {
      if (window.localStorage.getItem(LOGIN_EARGLY_KEY)) {
        loginEagerly();
        return;
      }
      if (window.localStorage.getItem(KEY_NAME)) {
        setLoginStatus(LoginStatus.LOCK);
        setIsWalletExist(true);
      } else if (TelegramPlatform.isTelegramPlatform()) {
        // Automatically obtain Telegram authorization
        isGettingTelegramAuthRef.current = true;
        handleTeleGram();
      }
    }
  }, [isLock, loginEagerly, handleTeleGram]);

  const handleEmail = () => {
    discoverUtils.removeDiscoverStorageSign();
    closeModal();
    setStyle(styles.inputForm);
    setDesign('Web2Design');
    setCurrentLifeCircle({});
    setTimeout(() => {
      signInRef.current?.setOpen(true);
    }, 500);
    setTimeout(() => {
      (document.getElementsByClassName('portkey-ant-segmented-item')?.[1] as HTMLElement)?.click();
    }, 1000);
  };

  const closeModal = () => {
    setDrawerVisible(false);
    setModalVisible(false);
  };

  const handlePhone = () => {
    discoverUtils.removeDiscoverStorageSign();
    closeModal();
    setStyle(styles.inputForm);
    setDesign('Web2Design');
    setCurrentLifeCircle({});
    setTimeout(() => {
      signInRef.current?.setOpen(true);
    }, 500);
  };

  const handleQrcode = () => {
    discoverUtils.removeDiscoverStorageSign();
    closeModal();
    setStyle(styles.qrcodeBox);
    setDesign('SocialDesign');
    setCurrentLifeCircle({ LoginByScan: undefined });
    setTimeout(() => {
      signInRef.current?.setOpen(true);
    }, 500);
  };

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [isUnlockShow, setIsUnlockShow] = useState(false);

  const [passwordValue, setPasswordValue] = useState('');

  const [isErrorTipShow, setIsErrorTipShow] = useState(false);

  const renderLoginMethods = (inModel: boolean) => {
    const allMethods = [
      // { name: 'Login with Portkey', onclick: handlePortKey, iconName: 'portkey' },
      {
        name: 'Login with Google',
        onclick: handleGoogle,
        yellowColor: !inModel ? true : undefined,
        iconName: 'google',
      },
      { name: 'Login with Apple', onclick: handleApple, yellowColor: !inModel ? true : undefined, iconName: 'apple' },
      { name: 'Login with Email', onclick: handleEmail, iconName: 'email' },
      {
        name: 'Login with Telegram',
        onclick: handleTeleGram,
        iconName: 'telegram',
      },
      { name: 'Login with QR code', onclick: handleQrcode, iconName: 'qrcode' },
    ];
    let filterMethods = allMethods;
    if (isInApp) {
      filterMethods = [allMethods[0]];
    } else if (isInIOS) {
      filterMethods = inModel
        ? [allMethods[1], ...allMethods.slice(3, allMethods.length)]
        : [allMethods[0], allMethods[2]];
    } else {
      filterMethods = inModel
        ? [allMethods[2], ...allMethods.slice(3, allMethods.length)]
        : [allMethods[0], allMethods[1]];
    }
    return filterMethods.map((item, index) => (
      <div key={index} onClick={item.onclick} className={item?.yellowColor ? styles.loginBtnYellow : styles.loginBtn}>
        {getIconComponent(item.iconName as IconType, inModel)}
        <span className="flex-1 text-center font-fonarto">{item.name}</span>
      </div>
    ));
  };

  const renderMoreContent = () => {
    return (
      <>
        <div className={styles.drawerHeader}>
          Login method
          {
            <CloseIcon
              className={styles.drawer__close}
              onClick={() => {
                closeModal();
              }}
            />
          }
        </div>
        {renderLoginMethods(true)}
      </>
    );
  };

  const getIconComponent = (name: IconType, inModel: boolean) => {
    const Con = components[name] || null;
    return <Con className={inModel ? styles.loginBtnBlueIcon : styles.loginBtnIcon} />;
  };

  const unlock = useCallback(
    async (v: string) => {
      let wallet;
      try {
        wallet = await did.load(v, KEY_NAME);
      } catch (err) {
        console.log(err);
        return;
      }
      if (!wallet.didWallet.accountInfo.loginAccount) {
        setIsErrorTipShow(true);
        setPasswordValue('');
        return;
      }

      const caInfo = wallet.didWallet.caInfo[configInfo!.curChain];
      const originChainId = localStorage.getItem(PORTKEY_LOGIN_CHAIN_ID_KEY);
      if (!originChainId) return;
      let caHash = caInfo?.caHash;

      if (!caInfo) {
        try {
          caHash = wallet.didWallet.caInfo[originChainId].caHash;
          const caAddress = wallet.didWallet.caInfo[originChainId].caAddress;
          setIsUnlockShow(false);
          handleFinish(WalletType.portkey, {
            caInfo: { caHash, caAddress },
            walletInfo: wallet.didWallet.managementAccount,
            pin: v,
            chainId: originChainId as ChainId,
          });
        } catch (err) {
          showMessage.error();
          return;
        }
      } else {
        setIsUnlockShow(false);
        const walletInfo = {
          caInfo,
          pin: v,
          chainId: configInfo!.curChain,
          walletInfo: wallet.didWallet.managementAccount,
        };
        handleFinish(WalletType.portkey, walletInfo);
      }
    },
    [configInfo, handleFinish],
  );

  useEffect(() => {
    if (TelegramPlatform.isTelegramPlatform() && isLock) {
      unlock(DEFAULT_PIN);
    }
  }, [isLock, unlock]);

  const { getRecommendationVerifier, verifySocialToken } = useVerifier();

  const handlePortKeyLoginFinish = useCallback(
    (wallet: DIDWalletInfo) => {
      signInRef.current?.setOpen(false);
      localStorage.setItem(PORTKEY_LOGIN_CHAIN_ID_KEY, wallet.chainId);
      handleFinish(WalletType.portkey, wallet);
    },
    [handleFinish],
  );

  const onStep2OfSignUpFinish = useCallback(
    async (res: TSignUpVerifier, value?: IGuardianIdentifierInfo) => {
      const identifier = value;
      if (!identifier) return console.error('No guardianIdentifier!');
      const list = [
        {
          type: identifier?.accountType,
          identifier: identifier?.identifier,
          verifierId: res.verifier.id,
          verificationDoc: res.verificationDoc,
          signature: res.signature,
        },
      ];
      if (TelegramPlatform.isTelegramPlatform()) {
        const params = {
          pin: DEFAULT_PIN,
          type: 'register' as AddManagerType,
          chainId: curChain,
          accountType: identifier?.accountType,
          guardianIdentifier: identifier?.identifier,
          guardianApprovedList: list,
        };
        const createResult = await createWallet(params);
        createResult && handlePortKeyLoginFinish(createResult);
      } else {
        setCurrentLifeCircle({
          SetPinAndAddManager: {
            guardianIdentifierInfo: identifier,
            approvedList: list,
          },
        });
        setTimeout(() => {
          signInRef.current?.setOpen(true);
        }, 500);
      }
    },
    [createWallet, curChain, handlePortKeyLoginFinish],
  );

  const onSignUp = useCallback(
    async (value: IGuardianIdentifierInfo) => {
      try {
        setLoading(true, 'Assigning a verifier on-chain…');
        await sleep(2000);
        const verifier = await getRecommendationVerifier(curChain);
        setLoading(false);
        const { accountType, authenticationInfo, identifier } = value;
        if (
          accountType === SocialLoginType.APPLE ||
          accountType === SocialLoginType.GOOGLE ||
          accountType === SocialLoginType.TELEGRAM
        ) {
          setLoading(true);
          console.log('authenticationInfo', authenticationInfo);
          const operationDetails = JSON.stringify({ manager: did.didWallet.managementAccount?.address });

          const result = await verifySocialToken({
            accountType,
            token: authenticationInfo?.authToken,
            guardianIdentifier: identifier,
            verifier,
            chainId: curChain,
            operationType: OperationTypeEnum.register,
            operationDetails,
          });
          setLoading(false);
          console.log(result);
          if (!result?.signature || !result?.verificationDoc) throw 'Verify social login error';
          onStep2OfSignUpFinish(
            {
              verifier,
              verificationDoc: result.verificationDoc,
              signature: result.signature,
            },
            value,
          );
        }
      } catch (error) {
        setLoading(false);
        const errorMsg = handleErrorMessage(error);
        errorTip(
          {
            errorFields: 'Check sign up',
            error: errorMsg,
          },
          true,
          () => {
            console.log('error');
          },
        );
      }
    },
    [curChain, getRecommendationVerifier, onStep2OfSignUpFinish, verifySocialToken],
  );

  const setModalOpen = () => {
    if (isMobileDevices()) {
      setDrawerVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const initializeProto = async () => {
    if (configInfo?.rpcUrl && configInfo?.beanGoTownContractAddress) {
      const protoBuf = await getProto(configInfo.beanGoTownContractAddress, configInfo.rpcUrl);
      const proto = Proto.getInstance();
      proto.setProto(protoBuf);
    }
  };

  useEffect(() => {
    initializeProto();
  }, [configInfo?.rpcUrl, configInfo?.beanGoTownContractAddress]);

  return (
    <div
      className={`cursor-custom ${styles.loginContainer}`}
      style={{
        backgroundImage: `url(${isMobileStore ? imageResources?.aloginBgMobile : imageResources?.aloginBgPc})`,
      }}>
      {!TelegramPlatform.isTelegramPlatform() &&
        (isLock ? (
          <div
            onClick={() => {
              setIsUnlockShow(true);
            }}
            className={styles.unlockBtn}>
            unLock
          </div>
        ) : isLogin ? null : (
          <>
            {renderLoginMethods(false)}
            {!isInApp && (
              <div
                className={styles.more}
                onClick={() => {
                  setModalOpen();
                }}>
                More
              </div>
            )}
          </>
        ))}
      <Drawer
        open={drawerVisible}
        placement={'bottom'}
        className={styles.loginMethodDrawer}
        onClose={() => {
          closeModal();
        }}
        maskClosable={true}>
        {renderMoreContent()}
      </Drawer>

      <Modal
        open={modalVisible}
        className={styles.loginMethodModal}
        onCancel={() => closeModal()}
        maskClosable={true}
        closable={false}>
        {renderMoreContent()}
      </Modal>

      <SignIn
        pin={TelegramPlatform.isTelegramPlatform() ? DEFAULT_PIN : undefined}
        keyboard
        ref={signInRef}
        design={design}
        defaultLifeCycle={currentLifeCircle}
        className={style}
        onFinish={handlePortKeyLoginFinish}
        isShowScan={true}
        defaultChainId={curChain}
      />

      <Unlock
        keyboard
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
        isWrongPassword={isErrorTipShow}
      />
    </div>
  );
}
