import { createReducer } from '@reduxjs/toolkit';
import { Util } from '../../interfaces';
import { AppConfigsActions } from '../actions';

const initialState: Util.AppConfig = {
  auth: {
    grantedPolicies: {}
  }
} as Util.AppConfig;

export default createReducer(initialState, build => {
  build.addCase(
    AppConfigsActions.setAppConfigStorage, (state, action) => {
      state = action.payload;
      return state;
  });
})