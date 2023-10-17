import { MouseEvent } from 'react';

export type BeanPassModalPropsType = {
  onConfirm?: (e: MouseEvent<any>) => void;
  onCancel: (e: MouseEvent<any>) => void;
  open: boolean;
  type: GetBeanPassStatus;
};

export enum ShowBeanPassType {
  Success = 'Success',
  Display = 'display',
}

export type BeanPassItemType = {
  symbol: string;
  tokenName: string;
  nftImageUrl: string;
};

export type ShowNFTModalPropsType = {
  onCancel: (e: MouseEvent<any>) => void;
  open: boolean;
  type: ShowBeanPassType;
  beanPassItem?: BeanPassItemType;
};

export enum GetBeanPassStatus {
  Recharge = 'recharge',
  Abled = 'abled',
  Noneleft = 'noneleft',
  Notfound = 'notfound',
  Need = 'need',
}

export type CountDownModalPropsType = {
  onConfirm?: (e: MouseEvent<any>) => void;
  onCancel: (e: MouseEvent<any>) => void;
  open: boolean;
};
