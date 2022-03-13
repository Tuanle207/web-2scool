import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toast } from 'react-toastify';
import { AuthService } from '../../api';
import { User, Util } from '../../interfaces';
import { busyService } from '../../services';
import { sleep } from '../../utils/SetTimeOut';
import { AuthActions } from '../actions';

function* login({ payload }: Util.IObject) {
  try {
    busyService.busy(true);
    yield sleep(2000);
    const data: User.LoginResponse = yield call(AuthService.login, payload);

    yield put(AuthActions.setLogin(data));

  } catch (err: any) {
    console.log('ERROR', err);
    if (err.statusCode === 400) {
      toast.error('Email hoặc mật khẩu không chính xác', {
        autoClose: 5000
      });
    } else if (err.message) {
      toast.error(err.message, {
        autoClose: 5000
      });
    } 
  } finally {
    busyService.busy(false);
  }
}

function* logout() {
  try {
    busyService.busy(true);
    yield call(AuthService.logout);
    yield put(AuthActions.setLogin({refresh_token: '', access_token: '', expires_in: 0}));
  } catch (err) {
    console.log('ERROR', err);
  } finally {
    busyService.busy(false);
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(AuthActions.postLoginAsync, login),
    takeLatest(AuthActions.postLogoutAsync, logout)
  ]);
} 