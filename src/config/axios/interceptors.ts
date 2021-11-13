import { toast } from 'react-toastify';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie';
import redux from '../../store';

export const configHttpRequest = (axios: AxiosInstance) => {
  const { token } = redux.store.getState().auth;

  

  axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    config.headers['Accept-Language'] = 'vi-vn'
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['RequestVerificationToken'] = Cookies.get('XSRF-TOKEN');
    return config;
  });
};

export const configHttpResponse = (axios: AxiosInstance) => {
  axios.interceptors.response.use((response: AxiosResponse) => {
    return response;
  },
  function(err: any) {
    if (err?.response?.status === 401) {

    } else if (err?.response?.status === 403) {
      toast.error('You have no right to access this page!');
    }
    console.log({err});
    const message = err?.response?.data?.detail || 'Unknown error has occurred!'
    throw new Error(message);
  }
);
};