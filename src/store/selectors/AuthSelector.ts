import { createSelector } from 'reselect';
import { IState } from '../reducers';

const Auth = (state: IState) => state.auth;

const token = createSelector(Auth, auth => auth.token);

export const AuthSelector = {
  token
};