import { createReducer } from '@reduxjs/toolkit';
import { Util } from '../../../interfaces';
import { AuthActions } from '../../actions';

const initial = {
  token: '',
  refreshToken: '',
  role: [],
  permissions: [],
  userProfile: {}
};

export default createReducer(initial, build => {
  build
    .addCase(
      AuthActions.setLogin, 
      (state: Util.IObject, action: Util.BaseAction) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
    });
});