import axios from 'axios';

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SentryMessageType, captureMessage } from 'utils/captureMessage';
import showMessage from 'utils/setGlobalComponentsInfo';

interface ResponseType<T> {
  code: string;
  message: string;
  data: T;
}

class Request {
  instance: AxiosInstance;
  baseConfig: AxiosRequestConfig = { baseURL: '/api', timeout: 60000 };

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign({}, this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        return config;
      },
      (error) => {
        console.error(`something were wrong when fetch ${config?.url}`, error);
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      <T>(response: AxiosResponse<ResponseType<T>>) => {
        const res = response.data;
        const { code, data, message: errorMessage } = response.data;
        if (config.baseURL?.includes('cms')) {
          return data;
        }
        if (config.baseURL?.includes('connect')) {
          return res;
        }

        if (code[0] !== '2') {
          captureMessage({
            type: SentryMessageType.HTTP,
            params: {
              name: config.url!,
              method: config.method!,
              query: config.data,
              description: response,
            },
          });
        }

        switch (code) {
          case '20000':
            return data;
          case '20001':
            return {};
          case '20002':
            return res;
          case '50000':
            showMessage.error(errorMessage);
            return null;
          default:
            showMessage.error(errorMessage);
            return res;
        }
      },
      (error) => {
        let errMessage = '';
        switch (error?.response?.status) {
          case 400:
            errMessage = 'Please check your internet connection and try again.';
            break;

          case 401:
            showMessage.error('Please check your internet connection and try again.');
            setTimeout(() => {
              location.pathname = '/login';
            }, 3000);
            break;

          case 404:
            errMessage = 'Please check your internet connection and try again.';
            break;

          case 500:
          case 501:
          case 502:
          case 503:
          case 504:
            errMessage = 'Please check your internet connection and try again.';
            break;

          default:
            errMessage = 'Please check your internet connection and try again.';
            break;
        }

        showMessage.error(errMessage);
        captureMessage({
          type: SentryMessageType.HTTP,
          params: {
            name: config.url!,
            method: config.method!,
            query: config.data,
            description: error,
          },
        });
        return Promise.reject(errMessage);
      },
    );
  }

  public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T, R>(url: string, data?: T, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.post(url, data, config);
  }

  public put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<R> {
    return this.instance.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

const cmsRequest = new Request({ baseURL: '/cms' });
const tokenRequest = new Request({
  baseURL: '/connect',
});

export default new Request({});
export { tokenRequest, cmsRequest };
