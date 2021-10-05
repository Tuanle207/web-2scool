import { ReduxWebProvider as ReduxProvider} from './common/providers';
import AppContainer from './components/AppContainer';

const App = () => {


  return (
    <ReduxProvider>
       <AppContainer />
    </ReduxProvider>
  );
};

export default App;