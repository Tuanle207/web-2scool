import { HttpClient } from '../config/axios/HttpClient';
import { configHttpRequest, configHttpResponse } from '../config/axios/interceptors';
import { isTokenValid } from '../config/axios/util';
import ENV from '../config/env';
import redux from '../store';

export const getApiService = async () => {
  const baseurl = ENV.host;

  // get token from store
  const { 
    auth: { token }
  } = redux.store.getState();

  // check token's valility
  if (!isTokenValid(token)) {
    // TODO: get new access token via refresh token
    
  }
  
  const httpClient = new HttpClient({
    baseUrl: baseurl,
    options: {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
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
    // withCredentials: true
  }});

  return httpClient;
};

export const getDefaultOAuthOptions = () => {
  const { oAuthConfig } = ENV;
  return {
    'grant_type': 'password',
    'scope': oAuthConfig.scope,
    'client_id': oAuthConfig.clientId,
    'client_secret': oAuthConfig.clientSecret,
  };
};