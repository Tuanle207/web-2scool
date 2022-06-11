import { useEffect, FC } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Controller, useForm } from 'react-hook-form';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Identity } from '../../interfaces';
import { useDialogController } from '../../hooks';
import { IdentityService } from '../../api';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../utils/regex-pattern';

export interface CreateOrUpdateUserRequestProps {
  editItem?: Identity.UserDto;
  assignableRoles: Identity.UserRoleDto[];
}

export interface CreateUpdateUserFormValues extends Identity.CreateUpdateUserDto {
  roles: Identity.UserRoleDto[];
}

const isEmailAlreadyUsedDebounced = AwesomeDebouncePromise(IdentityService.isEmailAlreadyUsed, 200);

const CreateOrUpdateUserRequest: FC<CreateOrUpdateUserRequestProps> = ({
  editItem,
  assignableRoles,
}) => {

  const { control, reset, watch, setValue, handleSubmit } = useForm<CreateUpdateUserFormValues>({
    defaultValues: {
      userName: '',
      name: '',
      email: '',
      phoneNumber: '',
      roleNames: [''],
      roles: [],
      password: '',
      extraProperties: {},
      concurrencyStamp: ''
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (editItem) {
      const { 
        userName, 
        name, 
        email, 
        phoneNumber, 
        roles,
        concurrencyStamp,
      } = editItem;
      reset({ 
        userName: userName,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        roleNames: roles?.map(x => x.name) || [],
        password: '',
        extraProperties: {},
        concurrencyStamp: concurrencyStamp,
        roles: assignableRoles.filter(x => roles.some(ar => ar.id === x.id)),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch(({ email, roles }, { name: fieldName }) => {
      if (fieldName === 'email') {
        setValue('userName', email);
      } else if (fieldName === 'roles') {
        setValue('roleNames', roles.map(x => x.name));
      }
    })
    return () => subscription.unsubscribe();
  }, [ watch, setValue ]);

  const validateUniqueEmail = async (value: string) => {
    if (!value || value?.length > 50 || !EMAIL_PATTERN.test(value || ''))  {
      return;
    }
    const isAlreadyUsed = await isEmailAlreadyUsedDebounced(value, editItem?.id || '');
    if (isAlreadyUsed) {
      return 'Địa chỉ email này đã được sử dụng bởi người dùng khác';
    }
  }

  return (
    <Container>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: 'Tên hiển thị là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên hiển thị không thể vượt quá 50 kí tự'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-user-name' 
              label='Tên hiển thị' 
              required
              autoComplete="new-user-name"
              autoFocus={true}
              style={{width: '40ch'}}
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: {
              value: true,
              message: 'Số điện thoại là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Số điện thoại không thể vượt quá 50 kí tự'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-user-phonenumber' 
              label='Số điện thoại' 
              required
              autoComplete="new-phone-no"
              style={{width: '40ch'}}
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="roles"
          render={({field: { onChange, ...props }}) => (
            <Autocomplete
              multiple
              id='create-user-role'
              options={assignableRoles}
              style={{width: '40ch'}}
              size='small'
              getOptionLabel={(option) => option.name}
              onChange={(e, newValue) => onChange(newValue)}
              {...props}
              getOptionSelected={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='standard'
                  label="Vai trò"
                  placeholder="Chọn vai trò"
                />
              )}
            />
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: 'Địa chỉ Email là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Địa chỉ Email không thể vượt quá 50 kí tự'
            },
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Địa chỉ email không hợp lệ'
            },
            validate: validateUniqueEmail,
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-user-email' 
              label='Email đăng nhập' 
              required
              autoComplete="new-email"
              style={{width: '40ch'}}
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: 'Mật khẩu là bắt buộc'
            },
            pattern: {
              value: PASSWORD_PATTERN,
              message: 'Mật khẩu phải gồm 6-20 kí tự, chỉ có thể gồm 0-9, a-z, A-Z, _ và kí tự đầu tiên phải là chữ cái'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-user-password' 
              label='Mật khẩu đăng nhập'
              type="password"
              required
              autoComplete='new-password'
              style={{width: '40ch'}}
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
    </Container>
  );
};

export default CreateOrUpdateUserRequest;