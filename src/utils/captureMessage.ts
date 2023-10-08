import * as Sentry from '@sentry/nextjs';

export enum Severity {
  Fatal = 'fatal',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

export type SentryMessageType = 'contract' | 'http' | 'info';
interface IParams<T, R> {
  name: string;
  method: string;
  query?: T;
  info: R;
  walletAddress?: string;
  contractAddress?: string;
}
interface ICaptureMessageProps<T, R> {
  type: SentryMessageType;
  level?: Severity;
  params: IParams<T, R>;
}

const getErrorText = <T, R>(type: SentryMessageType, params: IParams<T, R>) => {
  const { name, method, query, info, walletAddress } = params;
  let errorText = '';
  switch (type) {
    case 'info':
      errorText = `info: ${name} method:${method} ${info} ${walletAddress}`;
      break;
    default:
      errorText = `error: ${name} method:${method} fail, query: ${JSON.stringify(query)}, error:${JSON.stringify(
        info,
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
