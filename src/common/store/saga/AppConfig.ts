import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { AppConfigService } from '../../api';
import { Util } from '../../interfaces';
import { AppConfigActions, LoadingActions } from '../actions';

function* getAppConfig() {
  try {
    yield put(LoadingActions.fetchingAppConfig(true));
    const data: Util.IObject = yield call(AppConfigService.getAppConfig);
    
    yield put(AppConfigActions.setAppConfigStorage(data));

  } catch (err) {
    console.log('ERROR', err)
  } finally {
    yield put(LoadingActions.fetchingAppConfig(false));
  }
} 

export default function* () {
  yield all([
    takeLatest(AppConfigActions.getAppConfigAsync, getAppConfig)
  ]);
}