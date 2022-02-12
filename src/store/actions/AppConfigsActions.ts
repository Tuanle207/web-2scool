import { createAction } from '@reduxjs/toolkit';
import { Util } from '../../interfaces';

const getAppConfigAsync = createAction(
  'app/AppConfig/getAppConfigAsync'
);

const setAppConfigStorage = createAction(
  'app/AppConfig/setAppConfigStorage',
  (payload: Util.AppConfig) => ({payload})
);

export const AppConfigsActions = {
  getAppConfigAsync,
  setAppConfigStorage
};