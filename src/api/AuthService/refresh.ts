import qs from 'query-string';
import { User } from '../../interfaces';
import Endpoint from './@endpoint';
import { getAuthService, getConnectTokenUrlEncodedOptions } from '../BaseApiService';

export const refresh = async (refreshToken: string) => {
  try {
    const authService = getAuthService();
    const refreshOptions = getConnectTokenUrlEncodedOptions(true);
    const result = await authService.post<User.LoginResponse>(Endpoint.Login(), qs.stringify({
      'refresh_token': refreshToken, 
      ...refreshOptions,
    }));
    return result;
  } catch (error) {
    throw error;
  }
};