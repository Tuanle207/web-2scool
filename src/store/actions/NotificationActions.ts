import { createAction } from '@reduxjs/toolkit';

const getNotificationsAsync = createAction( 
  'app/NotificationActions/getNotificationAsync', 
  (payload: boolean) => ({payload}) 
);

const setNotificationsStorage = createAction( 
  'app/NotificationActions/setAppConfigStorage', 
  (payload: boolean) => ({payload}) 
);

const markAsSeenAsync = createAction( 
  'app/NotificationActions/markAsSeenAsync', 
  (payload: boolean) => ({payload}) 
);

export const LoadingActions = {
  getNotificationsAsync,
  setNotificationsStorage,
  markAsSeenAsync
};