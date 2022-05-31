import { FC, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Controller, useForm } from 'react-hook-form';
import { Regulation } from '../../interfaces';
import { useDialogController } from '../../hooks';
import { IdentityService } from '../../api';

export interface CreateOrUpdateCriteriaRequestProps {
  editItem?: Regulation.CriteriaDto;
}

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(IdentityService.isRoleNameAlreadyUsed, 200);

const CreateOrUpdateCriteriaRequest: FC<CreateOrUpdateCriteriaRequestProps> = ({
  editItem,
}) => {

  const { control, reset, handleSubmit } = useForm<Regulation.CreateUpdateCriteriaDto>({
    defaultValues: {
      displayName: '',
      description: ''
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (editItem) {
      const { displayName, description } = editItem;
      reset({ displayName, description });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const validateUniqueName = async (value: string) => {
    if (!value || value?.length > 50)  {
      return;
    }
    const isAlreadyUsed = await isNameAlreadyUsedDebounced(value, editItem?.id || '');
    if (isAlreadyUsed) {
      return 'Tên tiêu chí này đã được sử dụng';
    }
  }

  return (
    <Container>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="displayName"
          rules={{
            required: {
              value: true,
              message: 'Tên tiêu chí là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên tiêu chí không thể vượt quá 50 kí tự'
            },
            validate: validateUniqueName,
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-criteria-name' 
              label='Tên tiêu chí' 
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
      <Box style={{marginBottom: 10}}>
        <Controller
          control={control}
          name="description"
          rules={{
            maxLength: {
              value: 100,
              message: 'Mô tả không thể vượt quá 100 kí tự'
            }
          }}
          render={({field: { name, value, onChange, onBlur }, fieldState: { error }}) => (
            <TextField
              id='create-criteria-description' 
              label='Mô tả'
              autoComplete='off'
              multiline
              rowsMax={4}
              rows={4}
              style={{width: '40ch'}}
              name={name}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      </Box>
    </Container>
  );
};

export default CreateOrUpdateCriteriaRequest;