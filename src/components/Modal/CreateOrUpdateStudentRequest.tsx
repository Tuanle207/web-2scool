import { FC, useEffect } from 'react';
import { Box, Container, TextField, Select, InputLabel, FormControl, MenuItem, FormHelperText } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';
import { useDialogController } from '../../hooks';
import { Student, Class } from '../../interfaces';

export interface CreateOrUpdateStudentRequestProps {
  editItem?: Student.StudentDto;
  classes:  Class.ClassForSimpleListDto[];
}

const CreateOrUpdateStudentRequest: FC<CreateOrUpdateStudentRequestProps> = ({
  editItem,
  classes,
}) => {

  const { control, reset, handleSubmit } = useForm<Student.CreateUpdateStudentDto>({
    defaultValues: {
      name: '',
      classId: '',
      dob: moment().add(-16, 'years').toDate(),
      parentPhoneNumber: ''
 
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (!!editItem) {
      const { name, classId, dob, parentPhoneNumber } = editItem;
      reset({ name, classId, dob, parentPhoneNumber });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  return (
    <Container>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: 'Tên học sinh là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên học sinh không thể vượt quá 50 kí tự'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-student-name' 
              label='Tên học sinh' 
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Box style={{ marginBottom: 16 }}>
          <Controller
            control={control}
            name="dob"
            rules={{
              required: {
                value: true,
                message: 'Ngày sinh là bắt buộc'
              },
              validate: (value: Date) => {
                if (moment().isSameOrBefore(value)) {
                  return 'Ngày sinh không hợp lệ';
                }
              }
            }}
            render={({field, fieldState: { error }}) => (
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                variant="dialog"
                format="dd/MM/yyyy"
                margin="dense"
                id="create-student-dob"
                label="Ngày sinh"
                required
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Box>
      </MuiPickersUtilsProvider>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="classId"
          rules={{
            required: {
              value: true,
              message: 'Lớp học là bắt buộc'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <FormControl fullWidth error={!!error}>
              <InputLabel required htmlFor="create-student-class">Lớp học</InputLabel>
              <Select
                {...field}
                inputProps={{
                  name: 'class-course',
                  id: 'create-student-class',
                }}
              >
              {
                classes.map(el => (<MenuItem value={el.id}>{el.name}</MenuItem>))
              }
              </Select>
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          )}
        />
      </Box>
      <Box style={{marginBottom: 16}}>
        <Controller
          control={control}
          name="parentPhoneNumber"
          rules={{
            required: {
              value: true,
              message: 'Số điện thoại phụ huynh là bắt buộc'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-Student-parentPhoneNumber' 
              label='SĐT phụ huynh'
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
    </Container>
  );
};

export default CreateOrUpdateStudentRequest;