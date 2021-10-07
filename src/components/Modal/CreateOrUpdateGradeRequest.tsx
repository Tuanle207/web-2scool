import { useState, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Grade } from '../../interfaces';
import { useDataValidator } from '../../hooks';
import { GradesService } from '../../api';
import ActionModal from '.';

const CreateOrUpdateGradeRequest = ({id}: {id?: string}) => {

  const [data, setData] = useState<Grade.CreateUpdateGradeDto>({
    displayName: '',
    description: ''
  });
  const {errors, validate, getError} = useDataValidator();

  useEffect(() => {
    if (id) {
      GradesService.getGradeById(id).then(res => setData({
        displayName: res.displayName || '',
        description: res.description || '',
      }))
    }
  }, []);

  useEffect(() => {
    ActionModal.setData({
      data,
      error: errors.length > 0 ? {
        error: true,
        msg: errors[0].msg
      } : undefined
    });
  }, [data, errors]);


  return (
    <form style={{padding: '20px 0'}}>
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            // {...getError('mô tả')}
            id='create-grade-displayName' 
            label='Tên khối'
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.displayName}
            onChange={e => setData(prev => ({...prev, displayName: e.target.value}))}

          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField 
            // {...getError('mô tả')}
            id='create-drade-description' 
            label='Mô tả'
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.description}
            onChange={e => setData(prev => ({...prev, description: e.target.value}))}
          />
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateGradeRequest;