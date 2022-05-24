import { createReducer } from '@reduxjs/toolkit';
import { Util } from '../../interfaces';
import { TenantSettingActions } from '../actions';

const initial: Util.IObject = {
  displayName: '',
};

export default createReducer(initial, build => {
  build
    .addCase(
      TenantSettingActions.setTenantNameAsync, 
      (state: Util.IObject, action: Util.BaseAction) => {
        state.displayName = action.payload;
      });
});