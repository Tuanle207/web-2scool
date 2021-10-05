import { configureStore, Store } from '@reduxjs/toolkit';
import Storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { mobileReducer, webReducers } from './reducers';
import { mobileRootSaga, webRootSaga } from './saga';
import { createLogger } from 'redux-logger';
import { configEnv } from '../@config';
import { Persistor } from 'redux-persist/es/types';
import { Platform } from '../@config/common';

export class ReduxStore {
  private persistedReducer: any;
  private sagaMiddleware: any;
  private sagaRoot: any;
  store: Store;
  persistor: Persistor;
  
  constructor(reducers: any, sagaRoot: any) {
    const persistConfig = {
      key: 'root',
      storage: Storage,
      whilelist: ['auth'],
      blacklist: ['dcpReport']
    };
    this.sagaMiddleware = createSagaMiddleware();
    this.sagaRoot = sagaRoot;
    this.persistedReducer = persistReducer(persistConfig, reducers);
    this.store = configureStore({
      reducer: this.persistedReducer,
      middleware: configEnv().enableLogger ? [
        this.sagaMiddleware,
        createLogger()
      ] : [this.sagaMiddleware]
    });
    this.persistor = persistStore(this.store);
  }

  runSaga(): void {
    this.sagaMiddleware.run(this.sagaRoot);
  }
}

// get individual store at compile time
export const mobileStore: ReduxStore = new ReduxStore(mobileReducer, mobileRootSaga);
export const webStore: ReduxStore = new ReduxStore(webReducers, webRootSaga);

// Get the right store at runtime
export const getStore = () => configEnv().platform === Platform.WEB ? webStore.store : mobileStore.store;