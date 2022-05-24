import { createAction } from '@reduxjs/toolkit';

const setTenantNameAsync = createAction(
  'app/TenantSetting/setTenantNameAsync',
  (payload: string) => ({payload})
);

export const TenantSettingActions = {
  setTenantNameAsync
};