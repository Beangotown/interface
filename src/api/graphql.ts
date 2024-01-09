import { request, RequestDocument } from 'graphql-request';

import { store } from 'redux/store';
import showMessage from 'utils/setGlobalComponentsInfo';

interface ErrorItem {
  message: string;
}

interface Error {
  status: number;
  errors: ErrorItem[];
}

function isError(err: unknown): err is Error {
  return (err as Error).status !== undefined && (err as Error).errors.length > 0;
}

export const graphQLRequest = async <T>(document: RequestDocument) => {
  try {
    return await request<T>(store.getState().configInfo.configInfo!.beanGoTownGraphqlServer, document);
  } catch (err) {
    const response = (err as { response: unknown }).response;

    if (isError(response)) {
      // handle errors here
      const errorMessage = 'Please check your internet connection and try again.';
      switch (response.status) {
        case 400:
          showMessage.error(errorMessage);
          return;
        case 401:
          return;
        case 404:
          showMessage.error(errorMessage);
          return;
        default:
          return;
      }
    }

    return;
  }
};
