import { FC, useEffect } from 'react';
import { Box, Checkbox, Container, FormControl, FormControlLabel, Tooltip, TextField } from '@material-ui/core';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { Course } from '../../interfaces';
import { CoursesService } from '../../api';
import { useDialogController } from '../../hooks';
export interface CreateOrUpdateCourseRequestProps {
  editItem?: Course.CourseDto;
}

const isNameAlreadyUsedDebounced = AwesomeDebouncePromise(CoursesService.isNameAlreadyUsed, 200);

const CreateOrUpdateCourseRequest: FC<CreateOrUpdateCourseRequestProps> = ({
  editItem,
}) => {

  const { control, getValues, reset, handleSubmit } = useForm<Course.CreateUpdateCourseDto>({
    defaultValues: {
      name: '',
      description: '',
      startTime: new Date(),
      finishTime: moment().add(1, 'year').toDate(),
      fromActiveCourse: false
    },
  });

  useDialogController({ control, handleSubmit });

  useEffect(() => {
    if (!!editItem) {
      const { name, description, startTime, finishTime} = editItem;
      reset({ name, description, startTime, finishTime });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editItem]);

  const validateNameUnique = async (value: string) => {
    if (!value || value?.length > 50) {
      return;
    }
    try {
      const alreadyUsed = await isNameAlreadyUsedDebounced(editItem?.id ?? '', value);
      if (alreadyUsed) {
        return 'Tên khóa học này đã được sử dụng';
      }
    } catch {
      return true;
    }
  }

  return (
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: {
                value: true,
                message: 'Tên khóa học là bắt buộc'
              },
              maxLength: {
                value: 50,
                message: 'Tên không thể vượt quá 50 kí tự'
              },
              validate: validateNameUnique
            }}
            render={({field, fieldState: { error }}) => (
              <TextField
                id='create-course-name' 
                label='Tên khóa học'
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Box style={{marginBottom: 10}}>
            <Controller
              control={control}
              name="startTime"
              rules={{
                required: 'Ngày bắt đầu là bắt buộc',
                validate: (value: Date) => {
                  const finishTime = getValues('finishTime');
                  if (moment(value).isSameOrAfter(finishTime)) {
                    return 'Ngày bắt đầu phải trước ngày kết thúc'
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
                  id="create-course-start-date"
                  label="Ngày bắt đầu"
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
          <Box style={{marginBottom: 10}}>
            <Controller 
              control={control}
              name="finishTime"
              rules={{
                required: 'Ngày kết thúc là bắt buộc',
                validate: (value: Date) => {
                  const startTime = getValues('startTime');
                  if (moment(value).isSameOrBefore(startTime)) {
                    return 'Ngày kết thúc phải sau ngày bắt đầu'
                  }
                }
              }}
              render={({field: { name, value, onChange, onBlur }, fieldState: { error }}) => (
                <KeyboardDatePicker
                  required
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
        {
          !editItem && (
            <Tooltip title="Dữ liệu sẽ được sao chép từ khóa học đang hoạt động.">
              <Box style={{marginBottom: 16}}>
                <Controller
                  control={control}
                  name="fromActiveCourse"
                  render={({field: { value, onChange }}) => (
                    <FormControl fullWidth variant="standard" >
                      <FormControlLabel
                        control={<Checkbox color="primary" checked={value} onChange={(e) => onChange(e.target.checked)} />}
                        label="Tạo từ khóa học hiện tại"
                      />
                    </FormControl>
                  )}
                />
              </Box>
            </Tooltip>
          )
        }
    </Container>
  );
};

export default CreateOrUpdateCourseRequest;