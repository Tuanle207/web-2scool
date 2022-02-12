import { useState, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Identity } from '../../interfaces';
import ActionModal from '.';
import { useDataValidator } from '../../hooks';

const CreateOrUpdateRoleRequest = ({id}: {id?: string}) => {

  const [data, setData] = useState<Identity.CreateUpdateRoleDto>({
    name: ''
  });
  const {errors} = useDataValidator();

  useEffect(() => {
    if (id) {
      
    }
  }, [id]);

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
            id='create-role-name' 
            label='Tên Vai trò' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.name}
            onChange={e => setData(prev => ({...prev, name: e.target.value}))}
          />
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateRoleRequest;