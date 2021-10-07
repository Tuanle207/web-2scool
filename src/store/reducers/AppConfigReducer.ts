import { createReducer } from '@reduxjs/toolkit';
import { Util } from '../../interfaces';
import { AppConfigsActions } from '../actions';

const initialState: Util.IObject = {};

export default createReducer(initialState, build => {
  build.addCase(
    AppConfigsActions.setAppConfigStorage, 
    (state: Util.IObject, action: Util.BaseAction) => {
      state.appConfig = action.payload
  });
})