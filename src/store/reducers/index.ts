import { combineReducers } from 'redux';
import AppConfigReducer from './AppConfigReducer';
import AuthReducer from './AuthReducer';
import DcpReportReducer from './DcpReportReducer';
import LoadingReducer from './LoadingReducer';

const reducers = combineReducers({
  appConfig: AppConfigReducer,
  auth: AuthReducer,
  loading: LoadingReducer,
  dcpReport: DcpReportReducer
});

export default reducers