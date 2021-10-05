import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie';
import { webStore as store } from '../../store';

export const configHttpRequest = (axios: AxiosInstance) => {
  const token = store.store.getState().auth.token;
  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    config.headers['Accept-Language'] = 'vi-vn'
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['RequestVerificationToken'] = Cookies.get('XSRF-TOKEN');
    return config;
  });
};

export const configHttpResponse = (axios: AxiosInstance) => {
  axios.interceptors.response.use(function (response: AxiosResponse) {
    return response;
  });
};