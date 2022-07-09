import { createSelector } from 'reselect';
import { IState } from '../reducers';

const AppConfig = (state: IState) => state.appConfig;

const currentUser = createSelector(AppConfig, appConfig => appConfig.currentUser);
const currentAccount = createSelector(AppConfig, appConfig => appConfig.currentAccount);
const currentTenant = createSelector(AppConfig, appConfig => appConfig.currentTenant);
const grantedPolicies = createSelector(AppConfig, appConfig => appConfig.auth.grantedPolicies);


export const 
AppConfigSelector = {
  currentUser,
  currentAccount,
  currentTenant,
  grantedPolicies,
};