import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Container, FormControlLabel, Checkbox } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { User } from '../../interfaces';
import { AuthActions } from '../../store/actions';
import useLoginFormStyles from '../../assets/jss/components/Form/useLoginFormStyles';
import { TenantSettingSelector } from '../../store/selectors';

interface LoginFormProps {
  
}

const LoginForm: FC<LoginFormProps> = () => {

  const styles = useLoginFormStyles();

  const { control, handleSubmit } = useForm<User.LoginReqBody>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const schoolName = useSelector(TenantSettingSelector.displayName);

  const dispatch = useDispatch();

  const onSumbit = async (data: User.LoginReqBody) => {
    const { username, password } = data;
    dispatch(AuthActions.postLoginAsync({
      username,
      password
    }));
  };

  return (
    <Container className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit(onSumbit)}>
        <p className={styles.title}>{`Hệ thống quản lí nề nếp ${schoolName} - 2Scool`}</p>
        <Controller
          name="username"
          control={control}
          render={({field}) => (
            <TextField
              className={styles.textField}
              id="login-email"
              label="Email"
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({field}) => (
            <TextField
              className={styles.textField}
              id="login-password"
              label="Mật khẩu"
              type="password"
              {...field}
            />
          )}
        />
        
        <FormControlLabel
          className={styles.checkBox}
          control={
            <Checkbox
              name="checkedB"
              color="primary"
            />
          }
          label="Remember me"
        />
        <Button 
          className={styles.button}
          variant="contained"
          color="primary"
          type="submit"
          disableElevation
        >
          Đăng nhập
        </Button>
      </form>
    </Container>
  );
};

export default LoginForm;