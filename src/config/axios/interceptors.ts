import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie';
import redux from '../../store';
import { IState } from '../../store/reducers';
import { AuthService } from '../../api';
import { AuthActions } from '../../store/actions';
import { toUtcTime, toUtcTimeString } from '../../utils/TimeHelper';
import { Util } from '../../interfaces';

const isDate = (value: any): boolean => {
  return typeof value === 'object' && typeof value.getMonth === 'function';
};

const instanceOfFilter = (obj: any): obj is Util.PagingFilter => {
  return typeof obj === 'object' && ['key', 'comparison', 'value'].every(key => key in obj) && Object.keys(obj).length === 3;
};

const isTimeKey = (key: string) => {
  const dateTimePropsTraits = ['Time', 'time', 'Date', 'date'];
  return dateTimePropsTraits.some(x => key.includes(x));
};

const convertToUtcTime = (config: AxiosRequestConfig) => {
  if (config.data === undefined || config.data === null) {
    return;
  }
  if (typeof config.data === 'string') {
    const data = JSON.parse(config.data);
    recursiveParseUtcTime(data);
    config.data = JSON.stringify(data);
  } else if (typeof config.data === 'object') {
    const { data } = config;
    recursiveParseUtcTime(data);
  }
};

const recursiveParseUtcTime = (obj: any): void => {
  if (!obj) {
    return;
  }

  if (instanceOfFilter(obj) && isTimeKey(obj.key)) {
    obj.value = toUtcTimeString(obj.value);
    return;
  }

  Object.keys(obj).forEach(prop => {
    if (typeof(obj[prop]) === 'string' && isTimeKey(prop)) {
      obj[prop] = toUtcTimeString(obj[prop]);
    } else if (isDate(obj[prop]) && isTimeKey(prop)) {
      obj[prop] = toUtcTime(obj[prop]);
    } else if (Array.isArray(obj[prop])) {
      obj[prop].forEach((item: string) => {
        recursiveParseUtcTime(item);
      });
    } else if (typeof obj[prop] === 'object') {
      recursiveParseUtcTime(obj[prop]);
    }
  });
};

export const configHttpRequest = (axios: AxiosInstance) => {
  axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const url = config.url || '';
    if ([
      '/connect/token',
    ].includes(url)) {
      return config;
    }

    const { auth: { token } } = redux.store.getState() as IState;
    
    convertToUtcTime(config);

    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['Accept-Language'] = 'vi-vn'
    config.headers['RequestVerificationToken'] = Cookies.get('XSRF-TOKEN');
    return config;
  });
};

export const configHttpResponse = (axios: AxiosInstance) => {
  axios.interceptors.response.use((response: AxiosResponse) => {
    return response;
  },
  async (err: any) => {

    // Try getting new token via refresh token
    if (err?.response?.status === 401 && err?.config?.url !== '/connect/token') {
      const state = redux.store.getState() as IState;
      const { refreshToken } = state.auth;
      if (refreshToken) {
        const refreshRes = await AuthService.refresh(refreshToken);
        redux.store.dispatch(AuthActions.setLogin(refreshRes));
      }
    }
    // Forbidden error
    else if (err?.response?.status === 403) {
      // toast.error('You have no right to access this page!');
    }
    console.log({err});
    const message = err?.response?.data?.detail || 'Đã có lỗi xảy ra!'
    throw new Error(message);
  });
};