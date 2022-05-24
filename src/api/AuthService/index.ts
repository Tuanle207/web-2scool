// import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client';
// import { configEnv } from '../../@config';
import { login } from './login';
import { logout } from './logout';
import { refresh } from './refresh';

export const AuthService = {
  login,
  logout,
  refresh
};