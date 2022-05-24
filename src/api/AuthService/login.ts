import qs from 'query-string';
import { User } from '../../interfaces';
import { getAuthService, getConnectTokenUrlEncodedOptions } from '../BaseApiService';
import Endpoint from './@endpoint';

export const login = async (body: User.Login) => {
  try {
    const authService = getAuthService();
    const loginOptions = getConnectTokenUrlEncodedOptions();
    const result = await authService.post<User.LoginResponse>(Endpoint.Login(), qs.stringify({
      ...body, 
      ...loginOptions
    }));
    return result;
  } catch (error) {
    throw error;
  }
};