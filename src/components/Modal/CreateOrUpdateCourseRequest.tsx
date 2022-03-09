import { FC, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { Course } from '../../interfaces';
import { useDialogController } from '../../hooks';

export interface CreateOrUpdateCourseRequestProps {
  editItem?: Course.CourseDto;
}

const CreateOrUpdateCourseRequest: FC<CreateOrUpdateCourseRequestProps> = ({
  editItem
}) => {

  const { control, getValues, reset, trigger, formState } = useForm<Course.CreateUpdateCourseDto>({
    defaultValues: {
      name: '',
      description: '',
      startTime: new Date(),
      finishTime: moment().add(1, 'year').toDate()
    },
  });

  useDialogController({ control, trigger, formState });

  useEffect(() => {
    if (editItem) {
      const { name, description, startTime, finishTime} = editItem;
      reset({ name, description, startTime, finishTime });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  return (
    <form style={{padding: '20px 0'}}>
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: {
                value: true,
                message: 'Tên khóa học là bắt buộc'
              }
            }}
            render={({field, fieldState: { error }}) => (
              <TextField
                id='create-course-name' 
                label='Tên khóa học' 
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
        <Box style={{marginBottom: '10px'}}>
          <Controller
            control={control}
            name="description"
            rules={{
              required: {
                value: true,
                message: 'Mô tả khóa học là bắt buộc'
              }
            }}
            render={({field: { name, value, onChange, onBlur }, fieldState: { error }}) => (
              <TextField
                id='create-course-description' 
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
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box>
            <Controller
              control={control}
              name="startTime"
              render={({field: { name, value, onChange, onBlur }, fieldState: { error }}) => (
                <KeyboardDatePicker
                  disableToolbar
                  fullWidth
                  variant="dialog"
                  format="dd/MM/yyyy"
                  margin="dense"
                  id="create-course-start-date"
                  label="Ngày bắt đầu"
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
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
          <Box>
            <Controller 
              control={control}
              name="finishTime"
              rules={{
                validate: (value: Date) => {
                  const startTime = getValues('startTime');
                  if (moment(value).isSameOrBefore(startTime)) {
                    return 'Ngày kết thúc phải sau ngày bắt đầu'
                  }
                }
              }}
              render={({field: { name, value, onChange, onBlur }, fieldState: { error }}) => (
                <KeyboardDatePicker
                  disableToolbar
                  fullWidth
                  variant="dialog"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="create-course-end-date"
                  label="Ngày kết thúc"
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
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
        </MuiPickersUtilsProvider>
        
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateCourseRequest;