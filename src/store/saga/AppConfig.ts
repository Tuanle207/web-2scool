import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { AccountsService, AppConfigService, MultitenancyService } from '../../api';
import ENV from '../../config/env';
import { Account, Util } from '../../interfaces';
import { signalrService } from '../../services/signal-r-service';
import { getTenantNameFromCurrentLocation } from '../../utils/UrlHelper';
import { AppConfigsActions, TenantSettingActions, LoadingActions } from '../actions';

function* getAppConfig() {
  try {

    // Checking if the tenant domain valid else redirect to default page
    const tenant = getTenantNameFromCurrentLocation();
    const tenantDisplayName: string = yield call(MultitenancyService.getDisplayNameByTenantName, tenant);
    const invalidTenant = !tenantDisplayName && window.location.origin !== ENV.appUrl; 
    if (invalidTenant) {
      console.log(window.location.origin);
      console.log('window.location.origin');
      console.log(ENV.appUrl);
      console.log('ENV.appUrl');
      window.location.replace(ENV.appUrl);
    } else {
      // getting appconfig and current account info
      yield put(LoadingActions.fetchingAppConfig(true));
      const config: Util.AppConfig = yield call(AppConfigService.getAppConfig);
      const currentAccount: Account.CurrentAccountDto = yield call(AccountsService.getCurrentAccount);

      yield put(AppConfigsActions.setAppConfigStorage(config));
      yield put(AppConfigsActions.setCurrentAccountStorage(currentAccount));
      yield put(TenantSettingActions.setTenantNameAsync(tenantDisplayName));
      
      // restart signalr connection
      yield call(signalrService.restartAsync.bind(signalrService));
    }
  } catch (err) {
    console.log('ERROR', err)
  } finally {
    yield put(LoadingActions.fetchingAppConfig(false));
  }
} 

export default function* appConfigSaga() {
  yield all([
    takeLatest(AppConfigsActions.getAppConfigAsync, getAppConfig)
  ]);
}