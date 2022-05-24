import { createAction } from '@reduxjs/toolkit';
import { Account, Util } from '../../interfaces';

const getAppConfigAsync = createAction(
  'app/AppConfig/getAppConfigAsync'
);

const setAppConfigStorage = createAction(
  'app/AppConfig/setAppConfigStorage',
  (payload: Util.AppConfig) => ({payload})
);

const setCurrentAccountStorage = createAction(
  'app/AppConfig/setCurrentAccountStoage',
  (payload: Account.CurrentAccountDto) => ({payload})
)

export const AppConfigsActions = {
  getAppConfigAsync,
  setAppConfigStorage,
  setCurrentAccountStorage,
};