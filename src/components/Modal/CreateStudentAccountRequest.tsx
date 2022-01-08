import { useState, useEffect } from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Identity } from '../../interfaces';
import ActionModal from '.';
import { useDataValidator } from '../../hooks';
import { StudentsService } from '../../api';

const CreateStudentAccountRequest = ({id}: {id?: string}) => {

  const [data, setData] = useState<Identity.CreateUpdateUserDto>({
    userName: '',
    name: '',
    email: '',
    phoneNumber: '',
    roleNames: [''],
    password: '',
    extraProperties: {}
  });
  const [ selectedRoles ] = useState<Identity.UserRoleDto[]>([]);
  const { errors } = useDataValidator();

  useEffect(() => {

    const initData = async () => {

 
      if (!id) {
        return;
      }
      
      const student = await StudentsService.getStudentById(id);

      setData(prev => ({
          ...prev,
          name: student.name || '',
          extraProperties: {
            ClassId: student.classId
          }
        })
      );
    };

    initData();
  }, [id]);

  useEffect(() => {
    const dto = {...data};
    dto.roleNames = selectedRoles.map(x => x.name);

    ActionModal.setData({
      data: dto,
      error: errors.length > 0 ? {
        error: true,
        msg: errors[0].msg
      } : undefined
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <form style={{padding: '20px 0'}}>
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            // id='create-user-name' 
            label='Tên người dùng' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.name}
            disabled
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            // id='create-user-username' 
            label='Tên đăng nhập' 
            required
            autoComplete='new-username'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.userName}
            onChange={e => setData(prev => ({...prev, userName: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            // id='create-user-email' 
            label='Email' 
            required
            autoComplete='new-email'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.email}
            onChange={e => setData(prev => ({...prev, email: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            // id='create-user-phonenumber' 
            label='Số điện thoại' 
            required
            autoComplete='new-phone-no'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.phoneNumber}
            onChange={e => setData(prev => ({...prev, phoneNumber: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            // id='create-user-password' 
            label='Mật khẩu'
            type={'password'}
            autoComplete='new-password'
            style={{width: '40ch'}}
            value={data.password}
            onChange={e => setData(prev => ({...prev, password: e.target.value}))}
          />
        </Box>
      </Container>
    </form>
  );
};

export default CreateStudentAccountRequest;