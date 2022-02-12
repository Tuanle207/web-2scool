import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import redux from './store';
import AppContainer from './components/AppContainer';

const App = () => {

  useEffect(() => redux.runSaga(), []);

  return (
    <Provider store={redux.store}>
      <PersistGate loading={null} persistor={redux.persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
};

export default App;