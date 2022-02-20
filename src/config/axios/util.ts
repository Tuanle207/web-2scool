import jwt_decode, { JwtPayload } from 'jwt-decode';
import moment from 'moment';
import { Util } from '../../interfaces';

export const parseQueryString = (params: Util.IObject = {}) => {
  return Object.keys(params).reduce((queryStr, current, index) => {
    const head = index === 0 ? '?' : `${queryStr}&`;
    return `${head}${current}=${params[current]}`;
  }, '');
};

export class HttpException<T = any> {
  statusCode?: number;
  message?: string;
  data?: T;

  constructor(message?: string, statusCode?: number, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

/**
 * Validate token with token itself
 * @param token 
 * @returns true if token is valid
 * @deprecated Don't validate decode token in client side! User use isTokenExpired() insted
 */
export const isTokenValid = (token: string): boolean => {
  if (!token) {
    return false;
  }
  try {
    const decoded: JwtPayload = jwt_decode(token);
    if (!decoded || typeof(decoded) !== 'object' || !decoded.exp) {
      return false;
    }
    const now = new Date().valueOf();
    return now/1000 < decoded.exp;
  } catch (err) {
    console.log('invalid')
    return false;
  }
};

export const isTokenExpired = (issuedAt: Date, expiresIn: number) => {
  const DELAY_FROM_REQUESTING_TOKEN_FROM_SERVER = 10; // second
  const currentTime = moment();
  const expiryTime = moment(issuedAt).add(expiresIn - DELAY_FROM_REQUESTING_TOKEN_FROM_SERVER, 'seconds');
  return expiryTime.isAfter(currentTime);
};