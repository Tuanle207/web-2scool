import qs from 'query-string';
import { User } from '../../interfaces';
import { getAuthService, getLoginUrlEncodedOptions } from '../BaseApiService';
import Endpoint from './@endpoint';

export const login = async (body: User.Login) => {
  try {
    const authService = getAuthService();
    const loginOptions = getLoginUrlEncodedOptions();
    const result = await authService.post<User.LoginResponse>(Endpoint.Login(), qs.stringify({
      ...body, 
      ...loginOptions
    }));
    return result;
  } catch (error) {
    throw error;
  }
};