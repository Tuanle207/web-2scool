import { createReducer } from '@reduxjs/toolkit';
import { Util } from '../../../interfaces';
import { AppConfigActions } from '../../actions';

const initialState: Util.IObject = {};

export default createReducer(initialState, build => {
  build.addCase(
    AppConfigActions.setAppConfigStorage, 
    (state: Util.IObject, action: Util.BaseAction) => {
      state.appConfig = action.payload
  });
})