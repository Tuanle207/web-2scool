import { combineReducers } from '@reduxjs/toolkit';
import AppConfigReducer from './common/AppConfigReducer';
import AuthReducer from './common/AuthReducer';

export default combineReducers({
  appConfig: AppConfigReducer,
  auth: AuthReducer,
});