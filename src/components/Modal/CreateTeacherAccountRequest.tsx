import { FC, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Identity } from '../../interfaces';
import { useDialogController } from '../../hooks';
import { IdentityService } from '../../api';
import { EMAIL_PATTERN } from '../../utils/regex-pattern';

export interface CreateTeacherAccountRequestProps {
  teacherName: string;
  phoneNumber: string;
  email: string;
  teacherId: string;
}

const isEmailAlreadyUsedDebounced = AwesomeDebouncePromise(IdentityService.isEmailAlreadyUsed, 200);

const CreateTeacherAccountRequest: FC<CreateTeacherAccountRequestProps> = ({
  teacherName,
  phoneNumber,
  teacherId,
  email,
}) => {

  const { control, reset, watch, setValue, handleSubmit } = useForm<Identity.CreateUpdateUserDto>({
    defaultValues: {
      userName: 'username',
      name: '',
      email: '',
      phoneNumber: '',
      roleNames: [''],
      password: 'password',
      extraProperties: {},
      concurrencyStamp: ''
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    reset({ 
      userName: 'username',
      name: teacherName,
      email: email,
      phoneNumber: phoneNumber,
      roleNames: [''],
      password: 'password',
      concurrencyStamp: '',
      extraProperties: {
        'TeacherId': teacherId
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch(({ email }, { name: fieldName }) => {
      if (fieldName === 'email') {
        setValue('userName', email);
      }
    })
    return () => subscription.unsubscribe();
  }, [ watch, setValue ]);

  const validateUniqueEmail = async (value: string) => {
    if (!value || value?.length > 50 || !EMAIL_PATTERN.test(value || ''))  {
      return;
    }
    const isAlreadyUsed = await isEmailAlreadyUsedDebounced(value, '');
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
              style={{width: '40ch'}}
              {...field}
              error={!!error}
              helperText={error?.message}
              disabled
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
              autoComplete='new-phone-no'
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
              autoFocus
              required
              autoComplete='new-email'
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

export default CreateTeacherAccountRequest;