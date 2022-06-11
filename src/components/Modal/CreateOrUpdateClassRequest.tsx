import { useEffect, FC } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Select, 
  InputLabel, 
  FormControl, 
  MenuItem, 
  FormHelperText 
} from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Class, Grade, Teacher } from '../../interfaces';
import { useDialogController } from '../../hooks';
import { Controller, useForm } from 'react-hook-form';
import { ClassesService, TeachersService } from '../../api';

export interface CreateOrUpdateClassRequestProps {
  editItem?: Class.ClassDto;
  grades: Grade.GradeDto[];
  teachers: Teacher.TeacherForSimpleListDto[];
}

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(ClassesService.isNameAlreadyUsed, 200);

const CreateOrUpdateClassRequest: FC<CreateOrUpdateClassRequestProps> = ({
  editItem,
  grades,
  teachers,
}) => {

  const { control, reset, handleSubmit } = useForm<Class.CreateUpdateClassDto>({
    defaultValues: {
      name: '',
      gradeId: '',
      formTeacherId: undefined,
    }
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (!!editItem) {
      const { name, gradeId, formTeacherId } = editItem;
      reset({ name, gradeId, formTeacherId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const validateNotAFormTeacher = async (value: string) => {
    if (!value) {
      return;
    }
    try {
      const isFormTeacher = await TeachersService.isAlreadyFormTeacher(value, editItem?.id || '');
      if (isFormTeacher) {
        return 'Giáo viên này đã là giáo viên chủ nhiệm';
      }
    } catch {
      return true;
    }
  }

  const validateName = async (value: string) => {
    if (!value || value?.length > 20) {
      return;
    }
    if (value.length <= 7 || ['Lớp 10', 'Lớp 11', 'Lớp 12'].every(grade => !value.startsWith(grade))) {
      return 'Tên lớp phải có dạng "Lớp <khối><Kí tự phân loại><STT>", VD: Lớp 10A1';
    }
    try {
      const alreadyUsed = await isNameAlreadyUsedDebounced(editItem?.id ?? '', value);
      if (alreadyUsed) {
        return 'Tên lớp học này đã được sử dụng';
      }
    } catch {
      return true;
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
              message: 'Tên lớp là bắt buộc'
            },
            maxLength: {
              value: 20,
              message: 'Tên lớp không thể vượt quá 20 kí tự'
            },
            validate: validateName,
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-class-name' 
              label='Tên lớp'
              required
              autoComplete='off'
              autoFocus
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
          name="gradeId"
          rules={{
            required: {
              value: true,
              message: 'Khối là bắt buộc'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel required htmlFor="create-class-grade">Khối</InputLabel>
              <Select
                {...field}
                inputProps={{
                  name: 'class-grade',
                  id: 'create-class-grade',
                }}
              >
              {
                grades.map(el => (<MenuItem value={el.id}>{el.displayName}</MenuItem>))
              }
              </Select>
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Box>
      <Box style={{marginBottom: '10px'}}>
        <Controller
          control={control}
          name="formTeacherId"
          rules={{
            validate: validateNotAFormTeacher
          }}
          render={({field, fieldState: { error }})   => (
            <FormControl fullWidth error={!!error}>
              <InputLabel htmlFor="create-class-teacher">Giáo viên chủ nhiệm</InputLabel>
              <Select
                {...field}
                inputProps={{
                  name: 'class-teacher',
                  id: 'create-class-teacher',
                }}
              >
              {
                teachers.map(el => (<MenuItem value={el.id}>{el.name}</MenuItem>))
              }
              </Select>
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Box>
    </Container>
  );
};

export default CreateOrUpdateClassRequest;