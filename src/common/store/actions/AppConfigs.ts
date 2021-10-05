import { createAction } from '@reduxjs/toolkit';

const getAppConfigAsync = createAction(
  'app/AppConfig/getAppConfigAsync'
);

const setAppConfigStorage = createAction(
  'app/AppConfig/setAppConfigStorage',
  payload => ({payload})
);

export default {
  getAppConfigAsync,
  setAppConfigStorage
};