import React from 'react';
import { Box, Container, TextField, Select, InputLabel, FormControl, MenuItem } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Student, Class } from '../../common/interfaces';
import ActionModal from '.';
import { Validator } from '../../common/utils/DataValidation';
import { useDataValidator } from '../../hooks';
import { StudentsService, ClassesService } from '../../common/api';

const CreateOrUpdateStudentRequest = ({id}: {id?: string}) => {

  const [data, setData] = React.useState<Student.CreateUpdateStudentDto>({
    name: '',
    classId:  '',
    dob: new Date(),
    parentPhoneNumber: ''
  });
  const [classes, setClasses] = React.useState<Class.ClassForListDto[]>([]);
  const {errors, validate, getError} = useDataValidator();

  React.useEffect(() => {
    const initData = async () => {
      const classesRes = await ClassesService.getAllClasss({});
      setClasses(classesRes.items);
      if (id) {
        const studentRes = await StudentsService.getStudentById(id);
        setData({
          name: studentRes.name || '',
          classId: studentRes.classId || '',
          dob: studentRes.dob || new Date(),
          parentPhoneNumber: studentRes.parentPhoneNumber || ''
        });
      }
    }

    initData();
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
            id='create-student-name' 
            label='Tên học sinh' 
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
                id="create-student-dob"
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
          <FormControl fullWidth>
            <InputLabel htmlFor="create-student-class">Lớp học</InputLabel>
            <Select
              // native
              value={data.classId}
              onChange={e => setData(prev => ({...prev, classId: (e.target.value as string)}))}
              inputProps={{
                name: 'class-course',
                id: 'create-student-class',
              }}
            >
            {
              classes.map(el => (<MenuItem value={el.id}>{el.name}</MenuItem>))
            }
            </Select>
          </FormControl>
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            {...getError('mô tả')}
            id='create-Student-parentPhoneNumber' 
            label='SĐT phụ huynh'
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.parentPhoneNumber}
            onChange={e => setData(prev => ({...prev, parentPhoneNumber: e.target.value}))}
          />
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateStudentRequest;