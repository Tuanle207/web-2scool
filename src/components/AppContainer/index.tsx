import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StylesProvider, CssBaseline, ThemeProvider  } from '@material-ui/core'
import { toast, ToastContainer } from 'react-toastify';
import DashboardRouter from '../../routers/DashboardRouter';
import AuthRouter from '../../routers/AuthRouter';
import { theme, jss } from '../../assets/themes/theme';
import ActionModal from '../Modal';
import { AuthSelector, LoadingSelector } from '../../store/selectors';
import { AppConfigsActions } from '../../store/actions';
import { isTokenExpired } from '../../config/axios/util';
import Dialog from '../Modal/Dialog';
import { BusyBackdrop } from '../BusyBackdrop';
import 'react-toastify/dist/ReactToastify.css';

interface IAppContainerProps {
  
} 

const AppContainer: React.FC<IAppContainerProps> = () => {

  const issuedAt = useSelector(AuthSelector.issuedAt);
  const expiresIn = useSelector(AuthSelector.expiresIn);
  const fetchingAppConfig = useSelector(LoadingSelector.fetchingAppConfig);
  
  const dispatch = useDispatch();

  const isValid = useMemo(() => issuedAt && !isTokenExpired(issuedAt, expiresIn), [issuedAt, expiresIn]);

  useEffect(() => {
    dispatch(AppConfigsActions.getAppConfigAsync());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  return (
    <ThemeProvider theme={theme} >
      <StylesProvider jss={jss} >
        <CssBaseline>
          {
            fetchingAppConfig === undefined || fetchingAppConfig === true ? 
            <div>Đang tải...</div> :
            isValid ? <DashboardRouter /> : <AuthRouter />
          }
          <ToastContainer 
            position={toast.POSITION.BOTTOM_RIGHT}
            autoClose={2000}
            hideProgressBar
            theme="light"
            limit={6}
          />
          <ActionModal />
          <Dialog />
          <BusyBackdrop />
        </CssBaseline>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default AppContainer;