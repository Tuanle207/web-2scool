import { createReducer } from '@reduxjs/toolkit';
import { AuthActions } from '../actions';

export interface IAuthState {
  token?: string;
  refreshToken?: string;
  expiresIn: number;
}

const initial: IAuthState = {
  token: '',
  refreshToken: '',
  expiresIn: 0
};

export default createReducer(initial, build => {
  build
    .addCase(
      AuthActions.setLogin, 
      (state, action) => {
        state.token = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.expiresIn = action.payload.expires_in;
        return state;
    });
});