import React from 'react';
import LoginForm from '../components/Form/LoginForm';
import IntroForm from '../components/Form/IntroForm';
import { withRedux } from '../utils/ReduxConnect';
import { RouteComponentProps } from 'react-router';
import { Grid } from '@material-ui/core';
import useStyles from '../assets/jss/views/Login';

interface Props extends RouteComponentProps {
  children?: React.ReactNode;
  history: any;
  checkLogin: Function;
}

const Login: React.FC<Props> = ({ history }) => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container className={classes.wrapper} justify='center' alignItems='center' >
        <div className={classes.background}></div>
        <Grid item className={classes.introContainer}>
          <IntroForm history={history} />
        </Grid>
        <Grid item className={classes.loginContainer}>
          <LoginForm history={history} />
        </Grid>
      </Grid>
    </div>
  )
};

// export default Login;

export default withRedux({
  component: Login,
  dispatchProps: (dispatch: any) => ({
    checkLogin: (params: any) => dispatch({})
  })
});