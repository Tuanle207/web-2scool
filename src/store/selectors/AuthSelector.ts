import { createSelector } from 'reselect';
import { IState } from '../reducers';

const Auth = (state: IState) => state.auth;

const token = createSelector(Auth, auth => auth.token);
const issuedAt = createSelector(Auth, auth => auth.issuedAt);
const expiresIn = createSelector(Auth, auth => auth.expiresIn);
const refreshToken = createSelector(Auth, auth => auth.refreshToken);

export const AuthSelector = {
  token,
  issuedAt,
  expiresIn,
  refreshToken
};