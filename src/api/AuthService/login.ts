import qs from 'query-string';
import { User } from '../../interfaces';
import { getAuthService, getDefaultOAuthOptions } from '../BaseApiService';
import Endpoint from './@endpoint';

export default async (body: User.Login) => {
  try {
    const authService = getAuthService();
    const result = await authService.post<User.LoginResponse>(Endpoint.Login(), qs.stringify({
      ...body, 
      ...getDefaultOAuthOptions()
    }));
    return result;
  } catch (error) {
    throw error;
  }
};