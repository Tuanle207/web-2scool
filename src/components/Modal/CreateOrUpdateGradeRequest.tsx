import { FC, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useDialogController } from '../../hooks';
import { Grade } from '../../interfaces';
import { GradesService } from '../../api';

export interface CreateOrUpdateGradeRequestProps {
  editItem?: Grade.GradeDto;
};

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(GradesService.isNameAlreadyUsed, 200);

const CreateOrUpdateGradeRequest: FC<CreateOrUpdateGradeRequestProps> = ({
  editItem,
}) => {

  const { control, reset, handleSubmit } = useForm<Grade.CreateUpdateGradeDto>({
    defaultValues: {
      displayName: '',
      description: ''
    },
  });

  useDialogController({ control, handleSubmit });


  useEffect(() => {
    if (editItem) {
      const { displayName, description} = editItem;
      if (editItem) {
        reset({ displayName, description });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const validateUniqueName = async (value: string) => {
    if (!value || value?.length > 50) {
      return;
    }
    const isAlreadyUsed = await isNameAlreadyUsedDebounced(value, editItem?.id || '');
    if (isAlreadyUsed) {
      return 'Tên khối này đã được sử dụng';
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
              message: 'Tên khối là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên khối không thể vượt quá 50 kí tự'
            },
            validate: validateUniqueName
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-grade-displayName' 
              label='Tên khối'
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
          name="description"
          rules={{
            maxLength: {
              value: 50,
              message: 'Mô tả không thể vượt quá 50 kí tự'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-drade-description' 
              label='Mô tả'
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

export default CreateOrUpdateGradeRequest;