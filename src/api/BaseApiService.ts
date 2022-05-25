import { AuthService } from '.';
import { HttpClient } from '../config/axios/HttpClient';
import { configHttpRequest, configHttpResponse } from '../config/axios/interceptors';
import { isTokenExpired } from '../config/axios/util';
import ENV from '../config/env';
import redux from '../store';
import { AuthActions } from '../store/actions';
import { IState } from '../store/reducers';
import { getTenantNameFromCurrentLocation } from '../utils/UrlHelper';

export interface ApiServiceOptions {
  queryCurrentAccount?: boolean;
  queryActiveCourse?: boolean;
}

export const getApiService = async ({queryActiveCourse, queryCurrentAccount}: ApiServiceOptions = {
  queryActiveCourse: false, queryCurrentAccount: false
}) => {
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
      headers: { 
        'Content-Type': 'application/json',
        '2Scool-Active-Course': queryActiveCourse ? 1 : 0,
        '2Scool-Current-Account': queryCurrentAccount ? 1 : 0,
      },
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

export const getConnectTokenUrlEncodedOptions = (forRefresh: boolean = false) => {
  const { oAuthConfig } = ENV;
  const config = {
    'grant_type': forRefresh ? 'refresh_token' : 'password',
    'scope': oAuthConfig.scope,
    'client_id': oAuthConfig.clientId,
    'client_secret': oAuthConfig.clientSecret,
  };

  const tenant = getTenantNameFromCurrentLocation();

  return tenant ? {...config, '__tenant': tenant,} : config;
};