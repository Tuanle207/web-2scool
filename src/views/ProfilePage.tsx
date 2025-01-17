import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, TextField, Typography, Tabs, Tab, Button } from '@material-ui/core';
import Header from '../components/Header';
import { Profile, Util } from '../interfaces';
import { ProfileService } from '../api';
import { AppConfigSelector } from '../store/selectors';
import useStyles from '../assets/jss/views/ProfilePage';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { PASSWORD_PATTERN } from '../utils/regex-pattern';
import TabPanel, { a11yProps } from '../components/TabPanel';

interface IProfileTabProps extends Util.IHaveExtraProperties {
  name?: string;
  email?: string;
  phoneNumber?: string;
  roles?: string[];
}

const ProfileTab: FC<IProfileTabProps> = ({
  name,
  email,
  phoneNumber,
  roles = [],
  extraProperties
}) => {
  
  const classes = useStyles();

  return (
    <Grid container direction="row" style={{ flexWrap: 'nowrap' }}>
      <Grid item style={{ marginRight: 64 }}>
        <img 
          alt={name}
          src={"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"}
          className={classes.userPhoto}
          draggable={false}
        />
      </Grid>
      <Grid item container direction="column">
        <Grid item style={{ marginBottom: 16 }}>
          <Typography variant="caption">Họ tên</Typography>
          <Typography variant="body1">{ name || '' }</Typography>
        </Grid>
        <Grid item style={{ marginBottom: 16 }}>
          <Typography variant="caption">Số điện thoại</Typography>
          <Typography variant="body1">{ phoneNumber || "Chưa cập nhật" }</Typography>
        </Grid>
        <Grid item style={{ marginBottom: 16 }}>
          <Typography variant="caption">Email</Typography>
          <Typography variant="body1">{ email || '' }</Typography>
        </Grid>
        <Grid item style={{ marginBottom: 16 }}>
          <Typography variant="caption">Vai trò</Typography>
          <Typography variant="body1">{ roles.length > 0 ? roles[0] : 'Không có' }</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

interface IChangePasswordTabProps { }

interface IChangePasswordFormInputs {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordTab: FC<IChangePasswordTabProps> = () => {

  const { control, handleSubmit, getValues, reset } = useForm<IChangePasswordFormInputs>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: IChangePasswordFormInputs) => {
    try {
      await ProfileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
  
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword:'',
      });
  
      toast.success('Thay đổi mật khẩu thành công!');
    } catch (err) {
      console.log({err});
      toast.error('Đã có lỗi xảy ra, không thể đổi mật khẩu.');
    }
    
  };

  const onSubmitClick = (e: any) => {
    handleSubmit(onSubmit)(e);
  };

  return (
    <Grid container direction="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="currentPassword"
        control={control}
        rules={{
          required: "Vui lòng nhập mật khẩu hiện tại"
        }}
        render={({field: { ref, value, onChange, onBlur }, fieldState: { invalid, error }}) => (
          <TextField
            ref={ref}
            required
            id="xcurrent-password"
            label="Mật khẩu cũ" 
            type="password"
            autoComplete="new-password"
            style={{ marginBottom: 16 }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message}
            error={invalid}
          />
        )}
      />
      <Controller
        name="newPassword"
        control={control}
        rules={{
          required: "Vui lòng nhập mật khẩu mới",
          pattern: {
            value: PASSWORD_PATTERN,
            message: 'Mật khẩu phải gồm 6-20 kí tự, chỉ có thể gồm 0-9, a-z, A-Z, _ và kí tự đầu tiên phải là chữ cái'
          },
        }}
        render={({field: { ref, value, onChange, onBlur }, fieldState: { invalid, error }}) => (
          <TextField
            ref={ref}
            required
            id="new-password"
            label="Mật khẩu mới" 
            type="password"
            autoComplete="new-password"
            style={{ marginBottom: 16 }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message}
            error={invalid}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Vui lòng nhập lại mật khẩu",
          validate: (value) => {
            if (value !== getValues('newPassword')) {
              return "Mật khẩu không trùng khớp";
            }
            return true;
          }
        }}
        render={({field: { ref, value, onChange, onBlur }, fieldState: { invalid, error }}) => (
          <TextField
            ref={ref}
            required
            id="new-confirm-password"
            label="Xác nhận mật khẩu mới" 
            type="password"
            autoComplete="new-password"
            style={{ marginBottom: 16 }}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            helperText={error?.message}
            error={invalid}
          />
        )}
      />
      <Button type="submit" variant="contained" color="primary" style={{ marginTop: 32 }} onClick={onSubmitClick}>Lưu</Button>
    </Grid>
  );
};

const ProfilePage = () => {

  const classes = useStyles();
  
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ userProfile, setUserProfile ] = useState<Profile.GetMyProfileResponse>();

  const currentUser = useSelector(AppConfigSelector.currentUser);


  useEffect(() => {
    document.title = '2Scool | Thông tin người dùng';

    const { isAuthenticated } = currentUser;
    if (isAuthenticated) {
      ProfileService.getMyProfile()
        .then((data) => {
          setUserProfile(data);
        });
    }

  }, [ currentUser ]);

  const onTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item >
        <Header pageName="Tài khoản của tôi" hiddenSearchBar />
      </Grid>
      <Grid item container direction='column' style={{ flexGrow: 1 }}>
        <Grid container justify='space-between' className={classes.tabContainer}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tabIndex}
            onChange={onTabChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
          >
            <Tab label="Thông tin cá nhân" {...a11yProps(0)} />
            <Tab label="Đổi mật khẩu" {...a11yProps(1)} />
            <Tab label="Cài đặt" {...a11yProps(2)} />
          </Tabs>
          <TabPanel value={tabIndex} index={0} className={classes.tabView}>
            <ProfileTab
              name={userProfile?.name}
              email={userProfile?.email}
              phoneNumber={userProfile?.phoneNumber}
              roles={currentUser.roles}
              extraProperties={userProfile?.extraProperties ?? {}} 
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} className={classes.tabView}>
            <ChangePasswordTab />
          </TabPanel>
          <TabPanel value={tabIndex} index={2} className={classes.tabView}>
            Cài đặt
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;