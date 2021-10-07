import { all, fork } from 'redux-saga/effects';
import appConfigSaga from './AppConfig';
import authSaga from './Auth';
import dcpReportSaga from './DcpReport';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(appConfigSaga),
    fork(dcpReportSaga)
  ]);
};