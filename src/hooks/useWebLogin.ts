'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobileDevices } from 'utils/isMobile';
import { LOGIN_EARGLY_KEY } from 'constants/platform';
import { IPortkeyProvider } from '@portkey/provider-types';
import detectProvider from '@portkey/detect-provider';
import {
  selectInfo,
  setAccountInfoSync,
  setGameSetting,
  setLoginStatus,
  setPlayerInfo,
  setWalletInfo,
  setWalletType,
} from 'redux/reducer/info';
import { LoginStatus } from 'redux/types/reducerTypes';
import { store, useSelector } from 'redux/store';
import { AccountsType, IDiscoverInfo, SocialLoginType, WalletType, PortkeyInfoType, WalletInfoType } from 'types';
import { did, socialLoginAuth } from '@portkey/did-ui-react';
import isPortkeyApp from 'utils/inPortkeyApp';
import openPageInDiscover from 'utils/openDiscoverPage';
import getAccountInfoSync from 'utils/getAccountInfoSync';
import ContractRequest from 'contract/contractRequest';
import { GetGameLimitSettings, GetPlayerInformation } from 'contract/bingo';
import { SignatureParams } from 'aelf-web-login';
import useGetState from 'redux/state/useGetState';
import DetectProvider from 'utils/InstanceProvider';
import useIntervalAsync from './useInterValAsync';
import InstanceProvider from 'utils/InstanceProvider';
import showMessage from 'utils/setGlobalComponentsInfo';
import { ChainId } from '@portkey/provider-types';
import { useRouter } from 'next/navigation';
import { NetworkType } from 'constants/index';

const KEY_NAME = 'BEANGOTOWN';

export type DiscoverDetectState = 'unknown' | 'detected' | 'not-detected';

export default function useWebLogin({ signHandle }: { signHandle?: any }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginStatus } = useSelector(selectInfo);
  const [wallet, setWallet] = useState<WalletInfoType | null>(null);
  const [_curWalletType, setCurWalletType] = useState<WalletType>(WalletType.unknown);

  const [discoverProvider, setDiscoverProvider] = useState<IPortkeyProvider>();
  const [discoverDetected, setDiscoverDetected] = useState<DiscoverDetectState>('unknown');

  const [discoverInfo, setDiscoverInfo] = useState<IDiscoverInfo>();

  const [didWalletInfo, setDidWalletInfo] = useState<PortkeyInfoType>();

  const interval = useRef<number | null>(null);
  const isAsyncSuccess = useRef<boolean>(false);

  const { walletType, walletInfo } = useGetState();

  const { configInfo } = store.getState();

  const router = useRouter();

  const Network = configInfo.configInfo!.network;

  const curChain = configInfo.configInfo!.curChain as ChainId;

  const portKeyExtensionUrl = configInfo.configInfo!.portKeyExtensionUrl;

  useEffect(() => {
    window.onbeforeunload = window.onunload = () => {
      interval.current && window.clearInterval(interval.current);
    };
  }, []);

  const getAsyncAccount = useCallback(async () => {
    showMessage.loading('Syncing on-chain account info');
    const wallet = await InstanceProvider.getWalletInstance();
    if (!wallet?.portkeyInfo) {
      return;
    }
    try {
      const { holder, filteredHolders } = await getAccountInfoSync(curChain, wallet?.portkeyInfo);

      if (filteredHolders.length) {
        store.dispatch(
          setWalletInfo({
            portkeyInfo: {
              caInfo: {
                caAddress: holder.caAddress,
                caHash: holder.caHash,
              },
              pin: wallet.portkeyInfo.pin,
              chainId: curChain,
              walletInfo: wallet.portkeyInfo.walletInfo,
              accountInfo: wallet.portkeyInfo.accountInfo,
            },
          }),
        );
        isAsyncSuccess.current = true;
        interval.current && window.clearInterval(interval.current);
      }
    } catch (err) {
      console.log(err);
    }
  }, [curChain]);

  const asyncAccountInfo = useCallback(async () => {
    await getAsyncAccount();
    interval.current = window.setInterval(async () => {
      if (isAsyncSuccess.current) {
        interval.current && window.clearInterval(interval.current);
        return;
      }
      getAsyncAccount();
    }, 5000);
  }, [getAsyncAccount]);

  const detect = useCallback(async (): Promise<IPortkeyProvider> => {
    if (discoverProvider?.isConnected()) {
      return discoverProvider!;
    }
    let detectProviderFunc = detectProvider;
    if (typeof detectProvider !== 'function') {
      const detectProviderModule = detectProvider as any;
      detectProviderFunc = detectProviderModule.default;
    }
    let provider: IPortkeyProvider | null;
    try {
      provider = await detectProviderFunc();
    } catch (error) {
      setDiscoverDetected('not-detected');
      throw error;
    }
    if (provider) {
      if (!provider.isPortkey) {
        setDiscoverDetected('not-detected');
        throw new Error('Discover provider found, but check isPortkey failed');
      }
      setDiscoverProvider(provider);
      setDiscoverDetected('detected');
      return provider;
    } else {
      setDiscoverDetected('not-detected');
      throw new Error('Discover provider not found');
    }
  }, [discoverProvider]);

  const logout = useCallback(() => {
    store.dispatch(setWalletInfo(null));
    store.dispatch(setLoginStatus(LoginStatus.UNLOGIN));
    store.dispatch(setWalletType(WalletType.unknown));
    store.dispatch(setPlayerInfo(null));
    window.localStorage.removeItem(LOGIN_EARGLY_KEY);
    router.push('/login');
  }, [router]);

  const checkProviderConnected = useCallback(async () => {
    if (walletType !== WalletType.discover) {
      return;
    }
    const detectInfo = await detect();
    if (!detectInfo) return;

    detectInfo.on('disconnected', () => {
      logout();
    });
  }, [detect, logout, walletType]);

  useEffect(() => {
    checkProviderConnected();
  }, [checkProviderConnected, detect]);

  useEffect(() => {
    setIsLogin(loginStatus === LoginStatus.LOGGED);
  }, [loginStatus]);

  const handlePortKey = useCallback(async () => {
    if (isMobileDevices() && !isPortkeyApp()) {
      openPageInDiscover();
      return;
    }
    if (!window?.portkey && !isMobileDevices()) {
      window?.open(portKeyExtensionUrl, '_blank')?.focus();
      return;
    }

    const provider = await detect();
    if (!provider) {
      showMessage.error('Please update your extension to the latest version.');
      return;
    }
    const network = await provider?.request({ method: 'network' });
    if (network !== Network) {
      console.log(configInfo);
      if (Network === NetworkType.MAIN) {
        showMessage.error('Please switch to aelf Mainnet.');
      } else {
        showMessage.error('Please switch to aelf Testnet.');
      }

      return;
    }
    let accounts: any = await provider?.request({ method: 'accounts' });
    if (accounts[curChain] && accounts[curChain].length > 0) {
      onAccountsSuccess(provider, accounts);
      return;
    }
    accounts = await provider?.request({ method: 'requestAccounts' });
    if (accounts[curChain] && accounts[curChain].length > 0) {
      onAccountsSuccess(provider, accounts);
    } else {
      showMessage.error('Syncing on-chain account info');
    }
  }, []);

  const handleGoogle = async () => {
    setLoading(true);
    const res = await getSocialToken({ type: SocialLoginType.GOOGLE });
    await signHandle.onSocialFinish({
      type: res.provider,
      data: { accessToken: res.token },
    });
  };

  const handleApple = async () => {
    setLoading(true);
    const res = await getSocialToken({ type: SocialLoginType.APPLE });
    await signHandle.onSocialFinish({
      type: res.provider,
      data: { accessToken: res.token },
    });
  };

  const getSocialToken = async ({ type }: { type: SocialLoginType; clientId?: string; redirectURI?: string }) => {
    const tokenRes = await socialLoginAuth({
      type,
    });
    return tokenRes;
  };

  const updatePlayerInformation = useCallback(async (address: string) => {
    try {
      const information = await GetPlayerInformation(address);
      console.log('=====GetPlayerInformation res', information);
      store.dispatch(setPlayerInfo(information));
    } catch (error) {
      console.error('=====GetPlayerInformation error', error);
    }
  }, []);

  const initializeContract = useCallback(async () => {
    if (!walletInfo) {
      return;
    }
    const contract = ContractRequest.get();
    const config = {
      chainId: curChain,
      rpcUrl: configInfo.configInfo?.rpcUrl,
      contractAddress: configInfo!.configInfo!.bingoContractAddress,
    };
    contract.setWallet(walletInfo, walletType);
    contract.setConfig(config);

    let address = '';

    console.log(walletType);

    if (walletType === WalletType.discover) {
      address = walletInfo?.discoverInfo?.address || '';
    } else if (walletType === WalletType.portkey) {
      address = walletInfo?.portkeyInfo?.caInfo?.caAddress || '';
    } else {
      console.log('unknown address');
      return;
    }

    console.log('wallet.address', address);

    updatePlayerInformation(address);

    try {
      const gameSetting = await GetGameLimitSettings();
      store.dispatch(setGameSetting(gameSetting));
      console.log('gameSetting', gameSetting);
    } catch (err) {
      console.error('GetGameLimitSettingsErr:', err);
    }
  }, [configInfo, curChain, updatePlayerInformation, walletInfo, walletType]);

  const onAccountsSuccess = useCallback(async (provider: IPortkeyProvider, accounts: AccountsType) => {
    let nickName = 'Wallet 01';
    const address = accounts[curChain]?.[0].split('_')[1];
    console.log('address', address);

    try {
      nickName = await provider.request({ method: 'wallet_getWalletName' });
    } catch (error) {
      console.warn(error);
    }
    const discoverInfo = {
      address,
      accounts,
      nickName,
    };

    handleFinish(WalletType.discover, discoverInfo);
  }, []);

  const handleFinish = async (type: WalletType, walletInfo: PortkeyInfoType | IDiscoverInfo) => {
    console.log('wallet', type, walletInfo);

    if (type === WalletType.discover) {
      store.dispatch(setWalletType(type));
      localStorage.setItem(LOGIN_EARGLY_KEY, 'true');
      setDiscoverInfo(walletInfo);
      setWallet({ discoverInfo: walletInfo as IDiscoverInfo });
      setCurWalletType(type);
      store.dispatch(
        setWalletInfo({
          discoverInfo: walletInfo,
        }),
      );
      InstanceProvider.setWalletInfoInstance({
        discoverInfo: walletInfo,
      });
      store.dispatch(setLoginStatus(LoginStatus.LOGGED));
    } else if (type === WalletType.portkey) {
      did.save((walletInfo as PortkeyInfoType)?.pin || '', KEY_NAME);
      setDidWalletInfo(walletInfo as PortkeyInfoType);
      setWallet({
        portkeyInfo: walletInfo as PortkeyInfoType,
      });
      setCurWalletType(type);
      store.dispatch(setWalletType(WalletType.portkey));
      if ((walletInfo as PortkeyInfoType).chainId !== curChain) {
        InstanceProvider.setWalletInfoInstance({
          portkeyInfo: walletInfo as PortkeyInfoType,
        });
        asyncAccountInfo();
      } else {
        store.dispatch(
          setWalletInfo({
            portkeyInfo: walletInfo,
          }),
        );
      }
      store.dispatch(setLoginStatus(LoginStatus.LOGGED));
    }
  };

  const loginEagerly = useCallback(async () => {
    setLoading(true);
    try {
      const provider = await detect();
      const network = await provider.request({ method: 'network' });
      if (network !== Network) {
        console.log('ERR_CODE.NETWORK_TYPE_NOT_MATCH');
        setLoading(false);
        return;
      }
      const accounts = await provider.request({ method: 'accounts' });
      console.log(accounts);
      if (accounts[curChain] && accounts[curChain]!.length > 0) {
        onAccountsSuccess(provider, accounts);
        setLoading(false);
      } else {
        console.log('ERR_CODE.DISCOVER_LOGIN_EAGERLY_FAIL');
        setLoading(false);
      }
    } catch (error: any) {
      console.log({
        code: 10001,
        message: error?.message || 'unknown error',
        nativeError: error,
      });
      setLoading(false);
    }
  }, [onAccountsSuccess]);

  const getDiscoverSignature = useCallback(
    async (params: SignatureParams) => {
      // checkSignatureParams(params);
      const discoverInfo = walletInfo?.discoverInfo;
      if (!discoverInfo) {
        throw new Error('Discover not connected');
      }
      const discoverProvider = await DetectProvider.getDetectProvider();
      const provider = discoverProvider! as IPortkeyProvider;
      const signInfo = params.signInfo;
      const signedMsgObject = await provider.request({
        method: 'wallet_getSignature',
        payload: {
          data: signInfo || params.hexToBeSign,
        },
      });
      const signedMsgString = [
        signedMsgObject.r.toString(16, 64),
        signedMsgObject.s.toString(16, 64),
        `0${signedMsgObject.recoveryParam!.toString()}`,
      ].join('');
      return {
        error: 0,
        errorMessage: '',
        signature: signedMsgString,
        from: 'discover',
      };
    },
    [discoverInfo, discoverProvider],
  );

  const getPortKeySignature = useCallback(
    async (params: SignatureParams) => {
      // checkSignatureParams(params);
      if (!didWalletInfo) {
        throw new Error('Portkey not login');
      }
      let signInfo = '';
      if (params.hexToBeSign) {
        signInfo = params.hexToBeSign;
      } else {
        signInfo = params.signInfo;
      }
      const signature = did.sign(signInfo).toString('hex');
      return {
        error: 0,
        errorMessage: '',
        signature,
        from: 'portkey',
      };
    },
    [didWalletInfo],
  );

  return {
    isLogin,
    loading,
    discoverDetected,
    wallet,
    walletType,
    loginEagerly,
    handlePortKey,
    handleGoogle,
    handleApple,
    handleFinish,
    initializeContract,
    getDiscoverSignature,
    getPortKeySignature,
    updatePlayerInformation,
  };
}
