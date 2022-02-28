import { toast } from 'react-toastify';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie';
import redux from '../../store';
import { IState } from '../../store/reducers';
import { AuthService } from '../../api';
import { AuthActions } from '../../store/actions';

export const configHttpRequest = (axios: AxiosInstance) => {
  axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const url = config.url || '';
    if ([
      '/connect/token',
    ].includes(url)) {
      return config;
    }

    const { auth: { token } } = redux.store.getState() as IState;

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
      toast.error('You have no right to access this page!');
    }
    console.log({err});
    const message = err?.response?.data?.detail || 'Unknown error has occurred!'
    throw new Error(message);
  });
};