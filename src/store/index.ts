import { configureStore, Store } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import Storage from 'redux-persist/lib/storage';
import { Persistor } from 'redux-persist/es/types';
import { createLogger } from 'redux-logger';
import reduders from './reducers';
import rootSaga from './saga';
import ENV from '../config/env';

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
      middleware: ENV.enableLogger ? [
        this.sagaMiddleware,
        // createLogger()
      ] : [this.sagaMiddleware]
    });
    this.persistor = persistStore(this.store);
  }

  runSaga(): void {
    this.sagaMiddleware.run(this.sagaRoot);
  }
}

const redux: ReduxStore = new ReduxStore(reduders, rootSaga);

export default redux;