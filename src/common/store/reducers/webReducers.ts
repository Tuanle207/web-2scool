import { combineReducers } from '@reduxjs/toolkit';
import AppConfigReducer from './common/AppConfigReducer';
import AuthReducer from './common/AuthReducer';
import LoadingReducer from './common/LoadingReducer';
import DcpReportReducer from './common/DcpReportReducer';


export default combineReducers({
  appConfig: AppConfigReducer,
  auth: AuthReducer,
  loading: LoadingReducer,
  dcpReport: DcpReportReducer
});