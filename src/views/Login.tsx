import React from 'react';
import { RouteComponentProps } from 'react-router';
import LoginForm from '../components/Form/LoginForm';
import IntroForm from '../components/Form/IntroForm';
import { Grid } from '@material-ui/core';
import useStyles from '../assets/jss/views/Login';

interface Props extends RouteComponentProps {
  children?: React.ReactNode;
}

const Login: React.FC<Props> = () => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container className={classes.wrapper} justify="center" alignItems="center" >
        <div className={classes.background}></div>
        <Grid item className={classes.introContainer}>
          <IntroForm />
        </Grid>
        <Grid item className={classes.loginContainer}>
          <LoginForm />
        </Grid>
      </Grid>
    </div>
  )
};

export default Login;