import { createAction } from '@reduxjs/toolkit';

const fetchingAppConfig = createAction( 
  'app/LoadingAction/fetchingAppConfig', 
  (payload: boolean) => ({payload}) 
);

const sendingDcpReport = createAction( 
  'app/LoadingAction/sendingDcpReport', 
  (payload: boolean) => ({payload}) 
);

export default {
  fetchingAppConfig,
  sendingDcpReport
};
