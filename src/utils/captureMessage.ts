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
  NON = 'NON',
}

export enum SentryMessageType {
  CONTRACT = 'contract',
  HTTP = 'http',
  INFO = 'info',
  ERROR = 'error',
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
  const { name, query, description, walletAddress } = params;
  let errorText = '';
  switch (type) {
    case SentryMessageType.INFO:
      errorText = `info: ${name}, ${walletAddress}, ${JSON.stringify(description)}`;
      break;
    default:
      errorText = `error info: ${name}, ${walletAddress}, query: ${JSON.stringify(query)}, error:${JSON.stringify(
        description,
      )}`;
      break;
  }
  return errorText;
};

export const captureMessage = <T, R>({ type, params, level }: ICaptureMessageProps<T, R>) => {
  try {
    const errorText = getErrorText(type, params);
    console.error('captureMessage query:', JSON.stringify(params.query));
    console.error('captureMessage description:', JSON.stringify(params.description));
    Sentry.captureMessage(errorText, {
      tags: {
        name: params.name,
        method: params.method,
        walletAddress: params.walletAddress,
        contractAddress: params.contractAddress,
        type: type,
      },
      level: level || Severity.Error,
    });
  } catch (error) {
    console.error('captureMessage query:', params.query);
    console.error('captureMessage description:', params.description);
    Sentry.captureMessage(`${error}`, {
      tags: {
        name: params.name,
        method: params.method,
        walletAddress: params.walletAddress,
        contractAddress: params.contractAddress,
        type: type,
      },
      level: Severity.Error,
    });
  }
};
