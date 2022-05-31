import { FC, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Controller, useForm } from 'react-hook-form';
import { Identity } from '../../interfaces';
import { useDialogController } from '../../hooks';
import { IdentityService } from '../../api';

export interface CreateOrUpdateRoleRequestProps {
  editItem?: Identity.RoleDto;
}

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(IdentityService.isRoleNameAlreadyUsed, 200);

const CreateOrUpdateRoleRequest: FC<CreateOrUpdateRoleRequestProps> = ({
  editItem,
}) => {

  const { control, reset, handleSubmit } = useForm<Identity.CreateUpdateRoleDto>({
    defaultValues: {
      name: '',
      isDefault: false,
      isPublic: true,
      concurrencyStamp: '',
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (editItem) {
      const { name, isDefault, isPublic, concurrencyStamp } = editItem;
      reset({ name, isDefault, isPublic, concurrencyStamp });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const validateUniqueName = async (value: string) => {
    if (!value || value?.length > 50)  {
      return;
    }
    const isAlreadyUsed = await isNameAlreadyUsedDebounced(value, editItem?.id || '');
    if (isAlreadyUsed) {
      return 'Tên vai trò này đã được sử dụng';
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
              message: 'Tên vai trò là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên vai trò không thể vượt quá 50 kí tự'
            },
            validate: validateUniqueName,
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-role-name' 
              label='Tên Vai trò' 
              required
              autoComplete='off'
              autoFocus={true}
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

export default CreateOrUpdateRoleRequest;