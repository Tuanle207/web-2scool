import React from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Teacher } from '../../common/interfaces';
import ActionModal from '.';
import { Validator } from '../../common/utils/DataValidation';
import { useDataValidator } from '../../hooks';
import { TeachersService } from '../../common/api';

const CreateOrUpdateTeacherRequest = ({id}: {id?: string}) => {

  const [data, setData] = React.useState<Teacher.CreateUpdateTeacherDto>({
    name: '',
    dob: new Date(),
    email: '',
    phoneNumber: ''
  });
  const {errors, validate, getError} = useDataValidator();

  React.useEffect(() => {
    if (id) {
      TeachersService.getTeacherById(id).then(res => setData({
        name: res.name || '',
        dob: res.dob || new Date(),
        email: res.email || '',
        phoneNumber: res.phoneNumber || ''
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
            id='create-teacher-name' 
            label='Tên giáo viên' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.name}
            onChange={e => setData(prev => ({...prev, name: e.target.value}))}
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
                id="create-teacher-dob"
                label="Ngày sinh"
                value={data.dob}
                onChange={date => setData(prev => ({...prev, dob: date || prev.dob}))}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
          </Box>
          </MuiPickersUtilsProvider>
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            {...getError('mô tả')}
            id='create-teacher-email' 
            label='Email'
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.email}
            onChange={e => setData(prev => ({...prev, email: e.target.value}))}

          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            {...getError('mô tả')}
            id='create-teacher-phoneNumber' 
            label='Số điện thoại'
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.phoneNumber}
            onChange={e => setData(prev => ({...prev, phoneNumber: e.target.value}))}
          />
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateTeacherRequest;