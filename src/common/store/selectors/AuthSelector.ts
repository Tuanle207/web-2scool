import { createSelector } from 'reselect';
import { Util } from '../../interfaces';

const Auth = (state: Util.IObject) => state.auth;

const createTokenSelector = () => createSelector(Auth, auth => auth.token);

export default {
  createTokenSelector
};