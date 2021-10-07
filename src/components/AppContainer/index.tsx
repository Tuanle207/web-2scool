import { useEffect, useMemo } from 'react';
import { StylesProvider, CssBaseline, ThemeProvider } from '@material-ui/core'
import DashboardRouter from '../../routers/DashboardRouter';
import AuthRouter from '../../routers/AuthRouter';
import { theme, jss } from '../../assets/themes/theme';
import ActionModal from '../Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withRedux } from '../../utils/ReduxConnect';
import { AuthSelector, LoadingSelector } from '../../store/selectors';
import { AppConfigsActions } from '../../store/actions';
import { isTokenValid } from '../../config/axios/util';

interface Props {
  token: string;
  fetchingAppConfig: boolean;
  getAppConfig: () => void;
} 

const AppContainer: React.FC<Props> = ({ token, getAppConfig, fetchingAppConfig }) => {

  const isValid = useMemo(() => isTokenValid(token), [token]);

  useEffect(() => {
    if (isTokenValid(token))
    {
      getAppConfig();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <ThemeProvider theme={theme} >
      <StylesProvider jss={jss} >
        <CssBaseline>
          {
            fetchingAppConfig ? <div>loading...</div> :
            isValid ? <DashboardRouter /> : <AuthRouter />
          }
          <ToastContainer 
            position={toast.POSITION.BOTTOM_RIGHT}
            autoClose={2000}
            hideProgressBar
            limit={6}
          />
          <ActionModal />
        </CssBaseline>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default withRedux({
  component: AppContainer,
  stateProps: (state: any) => ({
    token: AuthSelector.createTokenSelector()(state),
    fetchingAppConfig: LoadingSelector.createFetchingAppConfigSelector()(state)
  }),
  dispatchProps: {
    getAppConfig: AppConfigsActions.getAppConfigAsync
  }
});
