import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { AppConfigService } from '../../api';
import { Util } from '../../interfaces';
import { AppConfigsActions, LoadingActions } from '../actions';

function* getAppConfig() {
  try {
    yield put(LoadingActions.fetchingAppConfig(true));
    const data: Util.AppConfig = yield call(AppConfigService.getAppConfig);
    yield put(AppConfigsActions.setAppConfigStorage(data));

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