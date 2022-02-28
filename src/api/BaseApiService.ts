import { AuthService } from '.';
import { HttpClient } from '../config/axios/HttpClient';
import { configHttpRequest, configHttpResponse } from '../config/axios/interceptors';
import { isTokenExpired } from '../config/axios/util';
import ENV from '../config/env';
import redux from '../store';
import { AuthActions } from '../store/actions';
import { IState } from '../store/reducers';

export const getApiService = async () => {
  const baseurl = ENV.host;

  // get token from store
  const { 
    auth: { refreshToken, issuedAt, expiresIn}
  } = redux.store.getState() as IState;

  // check token's valility and refresh token if possible
  if ( refreshToken && issuedAt && isTokenExpired(issuedAt, expiresIn)) {
    const refreshRes = await AuthService.refresh(refreshToken);
    redux.store.dispatch(AuthActions.setLogin(refreshRes));
  }
  
  const httpClient = new HttpClient({
    baseUrl: baseurl,
    options: {
      headers: { 'Content-Type': 'application/json' },
      // withCredentials: true,
    }
  });
  // config axios interceptor;
  httpClient.use(configHttpRequest);
  httpClient.use(configHttpResponse);

  return httpClient;
};

export const getAuthService = () => {
  const baseurl = ENV.oAuthConfig.issuer;

  const httpClient = new HttpClient({baseUrl: baseurl, options: {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }});

  return httpClient;
};

export const getLoginUrlEncodedOptions = () => {
  const { oAuthConfig } = ENV;
  return {
    'grant_type': 'password',
    'scope': oAuthConfig.scope,
    'client_id': oAuthConfig.clientId,
    'client_secret': oAuthConfig.clientSecret,
  };
};

export const getRefreshUrlEncodedOptions = () => {
  const { oAuthConfig } = ENV;
  return {
    'grant_type': 'refresh_token',
    'scope': oAuthConfig.scope,
    'client_id': oAuthConfig.clientId,
    'client_secret': oAuthConfig.clientSecret,
  }
};