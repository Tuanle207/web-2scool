import { FC } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useDialogController } from '../../hooks';
import { MultitenancyService } from '../../api';

export interface UpdateTenantFormData {
  name: string;
  displayName: string;
}

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(MultitenancyService.isTenantNameAlreadyUsed, 200);

export interface UpdateTenantRequestProps {
  id: string;
  initName: string;
  initDisplayName: string;
}

const UpdateTenantRequest: FC<UpdateTenantRequestProps> = ({
  id, initName, initDisplayName,
}) => {

  const { control, handleSubmit } = useForm<UpdateTenantFormData>({
    defaultValues: {
      name: initName,
      displayName: initDisplayName,
    },
  });

  useDialogController({ control, handleSubmit });

  const validateUniqueName = async (value: string) => {
    if (!value || value?.length > 50) {
      return;
    }
    const isAlreadyUsed = await isNameAlreadyUsedDebounced(value, id);
    if (isAlreadyUsed) {
      return 'Tên trường học này đã được sử dụng';
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
              message: 'Tên trường học là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên trường học không thể vượt quá 50 kí tự'
            },
            validate: validateUniqueName
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-tenant-name' 
              label='Tên trường học'
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
    </Container>
  );
};

export default UpdateTenantRequest;