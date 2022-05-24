import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import LoginForm from '../components/Form/LoginForm';
import IntroForm from '../components/Form/IntroForm';
import { Box, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { TenantSettingSelector } from '../store/selectors';
import useStyles from '../assets/jss/views/Login';

interface Props extends RouteComponentProps {
  children?: React.ReactNode;
}

const Login: React.FC<Props> = () => {

  const classes = useStyles();

  const schoolName = useSelector(TenantSettingSelector.displayName);

  useEffect(() => {
    const title = '2Scool | Hệ thống quản lý nề nếp {schoolName}'
    document.title = schoolName ? title.replace('{schoolName}', `- ${schoolName}`)
      : title.replace('{schoolName}', '');
  }, [schoolName]);

  return (
    <div className={classes.container}>
      <Grid container className={classes.wrapper} justify="center" alignItems="center" >
        <div className={classes.background}></div>
        <Box boxShadow={3} className={classes.form}>
          <Grid item className={classes.introContainer}>
            <IntroForm />
          </Grid>
          <Grid item className={classes.loginContainer}>
            <LoginForm />
          </Grid>
        </Box>
      </Grid>
    </div>
  )
};

export default Login;