import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toast } from 'react-toastify';
import { AuthService } from '../../api';
import { User, Util } from '../../interfaces';
import { AuthActions } from '../actions';

function* login({ payload }: Util.IObject) {
  try {
    // call API
    const data: User.LoginResponse = yield call(AuthService.login, payload);

    // create and dispatch SET LOGIN action
    yield put(AuthActions.setLogin(data));

  } catch (err: any) {
    console.log('ERROR', err);
    if (err.data?.error_description) {
      toast.error(err.data.error_description, {
        autoClose: 5000
      });
    } else if (err.message) {
      toast.error(err.message, {
        autoClose: 5000
      });
    } 
  }
}

function* logout() {
  try {
    yield call(AuthService.logout);
    yield put(AuthActions.setLogin({refresh_token: '', access_token: '', expires_in: 0}));
  } catch (err) {
    console.log('ERROR', err);
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(AuthActions.postLoginAsync, login), // listen for POST LOGIN SYNC action -> event handler = function LOGIN* above,
    takeLatest(AuthActions.postLogoutAsync, logout)
  ]);
} 