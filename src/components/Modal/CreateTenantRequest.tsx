import { Box, Container, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useDialogController } from '../../hooks';
import { MultitenancyService } from '../../api';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../utils/regex-pattern';

export interface CreateTenantFormData {
  name: string;
  displayName: string;
  adminEmailAddress: string;
  adminPassword: string;
}

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(MultitenancyService.isTenantNameAlreadyUsed, 200);

const CreateTenantRequest = () => {

  const { control, handleSubmit } = useForm<CreateTenantFormData>({
    defaultValues: {
      name: '',
      displayName: '',
      adminEmailAddress: '',
      adminPassword: '',
    },
  });

  useDialogController({ control, handleSubmit });

  const validateUniqueName = async (value: string) => {
    if (!value || value?.length > 50) {
      return;
    }
    const isAlreadyUsed = await isNameAlreadyUsedDebounced(value, '');
    if (isAlreadyUsed) {
      return 'Tên khách thuê này đã được sử dụng';
    }
  };

  return (
    <Container>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: 'Tên khách thuê là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên khách thuê không thể vượt quá 50 kí tự'
            },
            validate: validateUniqueName
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-tenant-name' 
              label='Tên khách thuê'
              required
              autoFocus
              autoComplete='off'
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
          name="displayName"
          rules={{
            required: {
              value: true,
              message: 'Tên hiển thị là bắt buộc'
            },
            maxLength: {
              value: 100,
              message: 'Tên hiển thị không thể vượt quá 100 kí tự'
            },
            validate: validateUniqueName
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-tenant-name' 
              label='Tên hiển thị'
              required
              autoComplete='off'
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
          name="adminEmailAddress"
          rules={{
            required: {
              value: true,
              message: 'Email quản trị viên là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Email quản trị viên không thể vượt quá 50 kí tự'
            },
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Địa chỉ email không hợp lệ'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-tenant-email' 
              label='Email quản trị viên'
              autoComplete='off'
              required
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
          name="adminPassword"
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
              id='create-tenant-pasword' 
              label='Mật khẩu đăng nhập'
              autoComplete='off'
              type="password"
              required
              style={{width: '40ch'}}
              {...field}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
      {/* <Box style={{marginBottom: 16}}>
        <div>
        className={classes.button}

        <Button
          variant="contained"
          color="default"
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
        </div>
      </Box> */}
    </Container>
  );
};

export default CreateTenantRequest;