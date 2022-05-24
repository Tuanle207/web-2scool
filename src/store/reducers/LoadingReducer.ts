import { createReducer } from '@reduxjs/toolkit';
import { Util } from '../../interfaces';
import { LoadingActions } from '../actions';

const initial: Util.IObject<boolean | undefined> = {
  fetchingAppConfig: undefined,
  sendingDcpReport: undefined
};

export default createReducer(initial, build => {
  build
    .addCase(
      LoadingActions.fetchingAppConfig, 
      (state: Util.IObject, action: Util.BaseAction) => {
        state.fetchingAppConfig = action.payload;
    })
    .addCase(
      LoadingActions.sendingDcpReport, 
      (state: Util.IObject, action: Util.BaseAction) => {
        state.sendingDcpReport = action.payload;
    });;
});