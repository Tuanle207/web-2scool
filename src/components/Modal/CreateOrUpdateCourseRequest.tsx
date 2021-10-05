import React from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Course } from '../../common/interfaces';
import ActionModal from '.';
import { Validator } from '../../common/utils/DataValidation';
import { useDataValidator } from '../../hooks';
import { CoursesService } from '../../common/api';

const CreateOrUpdateCourseRequest = ({id}: {id?: string}) => {

  const [data, setData] = React.useState<Course.CreateUpdateCourseDto>({
    name: '',
    description: '',
    startTime: new Date(),
    finishTime: new Date()
  });
  const {errors, validate, getError} = useDataValidator();

  React.useEffect(() => {
    if (id) {
      CoursesService.getCourseById(id).then(res => setData({
        name: res.name || '',
        description: res.description || '',
        startTime: res.startTime || new Date(),
        finishTime: res.finishTime || new Date()
      }))
    }
  }, [id]);

  React.useEffect(() => {
    ActionModal.setData({
      data,
      error: errors.length > 0 ? {
        error: true,
        msg: errors[0].msg
      } : undefined
    });
  }, [data]);


  const nameChange = (value: string) => {
    setData(prev => ({...prev, name: value}))
    validate('tên', value, Validator.isNotEmpty);
  };
  const descriptionChange = (value: string) => {
    setData(prev => ({...prev, description: value}))
    validate('mô tả', value, Validator.isNotEmpty);
  };

  return (
    <form style={{padding: '20px 0'}}>
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            {...getError('tên')}
            id='create-course-name' 
            label='Tên khóa học' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.name}
            onChange={({target: { value }}) => nameChange(value)}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            {...getError('mô tả')}
            id='create-course-description' 
            label='Mô tả'
            autoComplete='off'
            multiline
            rowsMax={4}
            rows={4}
            style={{width: '40ch'}}
            value={data.description}
            onChange={({target: { value }}) => descriptionChange(value)}
          />
        </Box>
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box>
              <KeyboardDatePicker
                disableToolbar
                fullWidth
                variant="dialog"
                format="dd/MM/yyyy"
                margin="dense"
                id="create-course-start-date"
                label="Ngày bắt đầu"
                value={data.startTime}
                onChange={date => setData(prev => ({...prev, startTime: date || prev.startTime}))}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
          </Box>
          <Box>
            <KeyboardDatePicker
              disableToolbar
              fullWidth
              variant="dialog"
              format="dd/MM/yyyy"
              margin="normal"
              id="create-course-end-date"
              label="Ngày kết thúc"
              value={data.finishTime}
              onChange={date => setData(prev => ({...prev, finishTime: date || prev.startTime}))}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Box>
        </MuiPickersUtilsProvider>
        
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateCourseRequest;