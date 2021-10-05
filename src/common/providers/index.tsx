import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { webStore, mobileStore } from '../store';

export const ReduxWebProvider = ({ children }: { children: JSX.Element }) => {
  React.useEffect(() => webStore.runSaga(), []);
  return (
    <Provider store={webStore.store}>
      <PersistGate loading={null} persistor={webStore.persistor}>
        { children }
      </PersistGate>
    </Provider>
  )
};

export const ReduxMobileProvider = ({ children }: { children: JSX.Element }) => {
  React.useEffect(() => mobileStore.runSaga(), []);
  return (
    <Provider store={mobileStore.store}>
      <PersistGate loading={null} persistor={mobileStore.persistor}>
        { children }
      </PersistGate>
    </Provider>
  )
};