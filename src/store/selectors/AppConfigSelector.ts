import { createSelector } from 'reselect';
import { IState } from '../reducers';

const AppConfig = (state: IState) => state.appConfig;

const currentUser = createSelector(AppConfig, appConfig => appConfig.currentUser);
const grantedPolicies = createSelector(AppConfig, appConfig => appConfig.auth.grantedPolicies);

export const AppConfigSelector = {
  currentUser,
  grantedPolicies: grantedPolicies
};