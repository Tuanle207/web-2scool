import { combineReducers } from 'redux';
import AppConfigReducer from './AppConfigReducer';
import AuthReducer, { IAuthState } from './AuthReducer';
import DcpReportReducer from './DcpReportReducer';
import LoadingReducer from './LoadingReducer';
import TenantSettingReducer from './TenantSettingReducer';
import { Util, DcpReport } from '../../interfaces';

export interface IState {
  appConfig: Util.AppConfig;
  auth: IAuthState;
  loading: Util.IObject<boolean | undefined>,
  dcpReport: DcpReport.CreateUpdateDcpReportDto,
  tenantSetting: Util.TenantSetting,
} 

const reducers = combineReducers<IState>({
  appConfig: AppConfigReducer,
  auth: AuthReducer,
  loading: LoadingReducer,
  dcpReport: DcpReportReducer,
  tenantSetting: TenantSettingReducer,
});

export default reducers