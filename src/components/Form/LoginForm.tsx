import { FC, ReactNode, useEffect, useState } from 'react';
import { TextField, Button, Container, FormControlLabel, Checkbox } from '@material-ui/core';
import useLoginFormStyles from '../../assets/jss/components/Form/useLoginFormStyles';
import { User } from '../../interfaces';
import { withRedux } from '../../utils/ReduxConnect';
import { AuthActions } from '../../store/actions';
// import { AuthService } from '../../common/api/AuthService';
// import { IdentityService } from '../../common/api';

interface Props {
  children?: ReactNode;
  history: any;
  auth: any;
  postLogin: (params: User.LoginReqBody) => void;
}

const LoginForm: FC<Props> = ({ history, auth, postLogin }) => {

  const styles = useLoginFormStyles();
  
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  // const [ authService, setAuthService ] = React.useState<AuthService>(new AuthService());

  useEffect(() => {
    // authService.getUser().then(user => console.log({user}));
    // authService.userManager.signinCallback().then(user => console.log({user}));
    // IdentityService.createRole({name: 'test'});
  });

  const onFormSumbit = (e: any) => {
    e.preventDefault();
    postLogin({username: email, password: password});
    // authService.login();
  };

  return (
    <Container className={styles.formContainer}>
      <form className={styles.form} onSubmit={onFormSumbit}>
        <p className={styles.title}>Hệ thống quản lí nề nếp - 2COOL</p>
        <TextField
          className={styles.textField}
          id='login-email'
          label='Email'
          // required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          className={styles.textField}
          id='login-password'
          label='Mật khẩu'
          // required
          value={password}
          type='password'
          onChange={e => setPassword(e.target.value)}
        />
        <FormControlLabel
        className={styles.checkBox}
          control={
            <Checkbox
              // checked={state.checkedB}
              // onChange={handleChange}
              name="checkedB"
              color="primary"
            />
          }
          label="Remember me"
        />
        <Button 
          className={styles.button}
          variant='contained'
          color='primary'
          type='submit'
          disableElevation
          onClick={onFormSumbit}
        >
          Đăng nhập
        </Button>
      </form>
    </Container>
  );
};

export default withRedux<Props>({
  component: LoginForm,
  stateProps: (state: any) => ({
    auth: state.auth
  }),
  dispatchProps: ({
    postLogin: AuthActions.postLoginAsync
  })
});