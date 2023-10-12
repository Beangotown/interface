import * as Sentry from '@sentry/nextjs';
import { Method } from 'axios';

export enum Severity {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

export enum MethodType {
  CALLSENDMETHOD = 'callSendMethod',
  CALLVIEWMETHOD = 'callViewMethod',
}

export enum SentryMessageType {
  CONTRACT = 'contract',
  HTTP = 'http',
  INFO = 'info',
}
interface IParams<T, R> {
  name: string;
  method: MethodType | Method;
  query?: T;
  description: R;
  walletAddress?: string;
  contractAddress?: string;
}
interface ICaptureMessageProps<T, R> {
  type: SentryMessageType;
  level?: Severity;
  params: IParams<T, R>;
}

const getErrorText = <T, R>(type: SentryMessageType, params: IParams<T, R>) => {
  const { name, method, query, description, walletAddress } = params;
  let errorText = '';
  switch (type) {
    case SentryMessageType.INFO:
      errorText = `info: ${name} method:${method} ${description} ${walletAddress}`;
      break;
    default:
      errorText = `error: ${name} method:${method} fail, query: ${JSON.stringify(query)}, error:${JSON.stringify(
        description,
      )} ${walletAddress}`;
      break;
  }
  return errorText;
};

export const captureMessage = <T, R>({ type, params, level }: ICaptureMessageProps<T, R>) => {
  const errorText = getErrorText(type, params);
  Sentry.captureMessage(errorText, {
    tags: {
      walletAddress: params.walletAddress,
      contractAddress: params.contractAddress,
      type: type,
    },
    level: level || Severity.Error,
  });
};
