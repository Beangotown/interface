import { IVerifyInfo, ManagerInfoType, TVerifierItem } from '@portkey/did-ui-react';
import { Accounts, ChainId } from '@portkey/provider-types';
import type { Manager } from '@portkey/services';
import { IBlockchainWallet } from '@portkey/types';
import { ModalProps } from 'antd';
import { BeanPassItemType } from 'components/CommonModal/type';
import { ICheckerboardItem } from 'pageComponents/Recreation/checkerboard';
import { INoticeModal } from 'redux/reducer/noticeModal';

export type TokenInfo = {
  decimals: number;
  symbol: string;
  tokenName?: string;
  address?: string;
  issueChainId?: number;
  issuer?: string;
  isBurnable?: boolean;
  totalSupply?: number;
};

export enum SupportedELFChainId {
  MAIN_NET = 'AELF',
  TDVV_NET = 'tDVV',
  TDVW_NET = 'tDVW',
}

export enum ContractMethodType {
  SEND = 'send',
  VIEW = 'view',
}

export enum SocialLoginType {
  APPLE = 'Apple',
  GOOGLE = 'Google',
}

export interface IContractError extends Error {
  code?: number;
  error?:
    | number
    | string
    | {
        message?: string;
      };
  errorMessage?: {
    message: string;
    name?: string;
    stack?: string;
  };
  Error?: string;
  from?: string;
  sid?: string;
  result?: {
    TransactionId?: string;
    transactionId?: string;
  };
  TransactionId?: string;
  transactionId?: string;
  value?: any;
}

export interface ISendResult {
  TransactionId: string;
  TransactionResult: string;
}

export type Step1StyleType = 'input-form' | 'qrcode-box';

export type SignInDesignType = 'Web2Design' | 'SocialDesign' | 'CryptoDesign';

export interface IAccountInfoSync {
  [key: string]: any;
}

export type ChainIdType = 'AELF' | 'tDVV' | 'tDVW';
export type AccountsType = {
  [key in ChainIdType]?: string[];
};

export interface IDiscoverInfo {
  address?: string;
  nickName?: string;
  accounts?: Accounts;
}

export enum OperationTypeEnum {
  // unknown
  unknown = 0,
  // register
  register = 1,
  // community recovery
  communityRecovery = 2,
  // add guardian
  addGuardian = 3,
  // delete guardian
  deleteGuardian = 4,
  // edit guardian
  editGuardian = 5,
  // remove other manager
  removeOtherManager = 6,
  // set login account
  setLoginAccount = 7,
}

export type TSignUpVerifier = { verifier: TVerifierItem } & IVerifyInfo;

export interface CallContractParams<T> {
  contractAddress: string;
  methodName: string;
  args: T;
}

export interface IBoutInformation {
  score: number;
  playId: number;
  gridNum: number;
  diceCount: number;
  diceNumbers: number[];
  startGridNum: number;
  endGridNum: number;
}

export interface IPlayerProps {
  resetStart?: boolean;
  diceCount: number;
}

export interface IPlayerInformation {
  playableCount: number;
  sumScore: number;
  curGridNum: number;
  beanPassOwned: boolean;
}
export enum WalletType {
  unknown = 'unknown',
  discover = 'discover',
  portkey = 'portkey',
}

export interface IDIDWalletInfo {
  caInfo: {
    caAddress: string;
    caHash: string;
  };
  pin: string;
  chainId: ChainId;
  walletInfo: IBlockchainWallet | { [key: string]: any };
  accountInfo: ManagerInfoType;
}

export type PortkeyInfoType = Partial<IDIDWalletInfo> & {
  accounts?: { [key: string]: any };
  walletInfo?: { [key: string]: any } | IBlockchainWallet;
};

export type WalletInfoType = {
  portkeyInfo?: PortkeyInfoType;
  discoverInfo?: IDiscoverInfo;
  accountInfoSync?: Array<Manager>;
};

export enum BeanPassResons {
  Claimed = 'Claimed',
  InsufficientElfAmount = 'InsufficientElfAmount',
  DoubleClaim = 'DoubleClaim',
}

export interface IBeanPassClaimRes {
  claimable: boolean;
  reason: BeanPassResons;
  transactionId: string;
  beanPassInfoDto: BeanPassItemType;
}

export interface IBeanPassClaimReq {
  caAddress: string;
}

export interface IErrorResponse {
  code: string;
  data: null;
  message: string;
}

export interface IGameSetting {
  dailyMaxPlayCount: number;
  dailyPlayCountResetHours: number;
}

export interface IConfigResponse {
  data: IConfigItems;
}

export interface IReward {
  text: string;
  reward: number;
}

export interface IConfigItems {
  rpcUrl: string;
  discoverRpcUrl: string;
  network: string;
  curChain: Chain;
  graphqlServer: string;
  portkeyServer: string;
  explorerBaseUrl: string;
  bingoGraphqlServer: string;
  portKeyExtensionUrl: string;
  portkeyServiceUrl: string;
  bingoContractAddress: string;
  leaderboardWeekAward: IReward[];
  leaderboardSeasonAward: IReward[];
  gameRules: string[];
  faucetContractAddress: string;
  stepUpdateDelay: number;
  beanPassTerminalUrl: string;
  sumScore: number;
  minElfNum: number;
  isHalloween?: boolean;
  explorerBeanPassUrl: string;
  forestNftDetailUrl: string;
}

export interface IChessboardData {
  data: ICheckerboardItem[][];
  imageResources: Record<string, string>;
  btnImageResources: {
    pc: Record<string, string>;
    mobile: Record<string, string>;
  };
  checkerboardCounts: number;
}

export interface IChessboardDataResponse {
  data: IChessboardData;
}

export interface IChessboardDataResponse {
  data: IChessboardData;
}

export interface INoticeModalResponse {
  data: Record<string, ModalProps & INoticeModal>;
}

export interface IGetRankQuery {
  CaAddress?: string;
  SkipCount?: number;
  MaxResultCount?: number | string;
}

export interface IRankHistoryQuery {
  CaAddress?: string;
  SeasonId?: string;
}

export interface IBeanPassListItem {
  symbol: string;
  tokenName: string;
  nftImageUrl: string;
  owned: boolean;
  usingBeanPass: boolean;
}

export interface ISetCurBeanBody {
  caAddress: string;
  symbol: string;
}

export interface ITransactionLog {
  Address: string;
  Name: string;
  Indexed: string[];
  NonIndexed: string;
}

export interface ITransactionResult {
  TransactionId: string;
  Status: string;
  Logs: ITransactionLog[];
  [props: string]: any;
}
