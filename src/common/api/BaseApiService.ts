import { configEnv } from '../@config';
import { HttpClient } from '../@helper/network/HttpClient';
import { configHttpRequest, configHttpResponse } from '../@helper/network/interceptors';
import { isTokenValid } from '../@helper/network/util';
import { getStore } from '../store';

export const getApiService = async () => {
  const baseurl = configEnv().host;

  // get token from store
  const { 
    auth: { token }
  } = getStore().getState();

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
  const baseurl = configEnv().oAuthConfig.issuer;

  const httpClient = new HttpClient({baseUrl: baseurl, options: {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // withCredentials: true
  }});

  return httpClient;
};

export const getDefaultOAuthOptions = () => {
  const { oAuthConfig } = configEnv();
  return {
    'grant_type': 'password',
    'scope': oAuthConfig.scope,
    'client_id': oAuthConfig.clientId,
    'client_secret': oAuthConfig.clientSecret,
  };
};