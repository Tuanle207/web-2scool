import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StylesProvider, CssBaseline, ThemeProvider  } from '@material-ui/core'
import { toast, ToastContainer } from 'react-toastify';
import DashboardRouter from '../../routers/DashboardRouter';
import AuthRouter from '../../routers/AuthRouter';
import { theme, jss } from '../../assets/themes/theme';
import { AuthSelector } from '../../store/selectors';
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
            isValid ? <DashboardRouter /> : <AuthRouter />
          }
          <ToastContainer 
            position={toast.POSITION.BOTTOM_RIGHT}
            autoClose={2000}
            hideProgressBar
            theme="light"
            limit={6}
          />
          <Dialog />
          <BusyBackdrop />
        </CssBaseline>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default AppContainer;