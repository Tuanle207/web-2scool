import { useEffect, FC } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import { Teacher } from '../../interfaces';
import { useDialogController } from '../../hooks';
import { Controller, useForm } from 'react-hook-form';
import { EMAIL_PATTERN } from '../../utils/regex-pattern';

export interface CreateOrUpdateTeacherRequestProps {
  editItem?: Teacher.TeacherDto;
}

const CreateOrUpdateTeacherRequest: FC<CreateOrUpdateTeacherRequestProps> = ({
  editItem
}) => {

  const { control, reset, handleSubmit } = useForm<Teacher.CreateUpdateTeacherDto>({
    defaultValues: {
      name: '',
      dob: moment().add(-22, 'years').toDate(),
      email: '',
      phoneNumber: '' 
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (!!editItem) {
      const { name, dob, email, phoneNumber } = editItem;
      reset({ name, dob, email, phoneNumber });
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
              message: 'Tên giáo viên là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Tên giáo viên không thể vượt quá 50 kí tự'
            },
          }}
          render={({field, fieldState: { error }}) => (
            <TextField
              id='create-teacher-name' 
              label='Tên giáo viên' 
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Box style={{marginBottom: 16}}>
          <Controller
            control={control}
            name="dob"
            rules={{
              required: 'Ngày sinh là bắt buộc',
              validate: (value: Date) => {
                if (moment().isSameOrBefore(value)) {
                  return 'Ngày sinh không hợp lệ';
                }
              }
            }}
            render={({field, fieldState: { error }}) => (
              <KeyboardDatePicker
                required
                disableToolbar
                fullWidth
                variant="dialog"
                format="dd/MM/yyyy"
                margin="dense"
                id="create-teacher-dob"
                label="Ngày sinh"
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
          name="email"
          rules={{
            required: {
              value: true,
              message: 'Địa chỉ email là bắt buộc'
            },
            maxLength: {
              value: 50,
              message: 'Địa chỉ Email thể vượt quá 50 kí tự'
            },
            pattern: {
              value: EMAIL_PATTERN,
              message: 'Địa chỉ email không hợp lệ'
            }
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-teacher-email' 
              label='Email'
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
          name="phoneNumber"
          rules={{
            required: {
              value: true,
              message: 'Số điện thoại là bắt buộc'
            },
            maxLength: {
              value: 20,
              message: 'Số điện thoại vượt quá 20 kí tự'
            }
          }}
          render={({field, fieldState: { error }}) => (
            <TextField 
              id='create-teacher-phoneNumber' 
              label='Số điện thoại'
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

export default CreateOrUpdateTeacherRequest;