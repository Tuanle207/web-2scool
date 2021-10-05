import React from 'react';
import LoginForm from '../components/Form/LoginForm';
import IntroForm from '../components/Form/IntroForm';
import { withRedux } from '../common/utils/ReduxConnect';
import { RouteComponentProps } from 'react-router';
import { Grid, makeStyles } from '@material-ui/core';
import bgImage from '../assets/img/login-bg.jpg';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%', 
    height: '100%', 
    position: 'relative', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  wrapper: {
    height: '100%',
    position: 'relative'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'blue',
    filter: 'blur(0px)'
  },
  introContainer: {
    backdropFilter: 'blur(1px)',
  },
  loginContainer: {
    backdropFilter: 'blur(1px)',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 10
  }
}));

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