import { createSelector } from 'reselect';
import { IState } from '../reducers';

const TenantSetting = (state: IState) => state.tenantSetting;

const displayName = createSelector(TenantSetting, loading => loading.displayName)

export const TenantSettingSelector = {
  displayName,
};