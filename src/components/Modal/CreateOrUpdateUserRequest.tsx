import React from 'react';
import { Box, Container, TextField } from '@material-ui/core';
import { Identity } from '../../common/interfaces';
import ActionModal from '.';
import { useDataValidator } from '../../hooks';
import { IdentityService } from '../../common/api';
import { Autocomplete } from '@material-ui/lab';

const CreateOrUpdateUserRequest = ({id}: {id?: string}) => {

  const [data, setData] = React.useState<Identity.CreateUpdateUserDto>({
    userName: '',
    name: '',
    email: '',
    phoneNumber: '',
    roleNames: [''],
    password: '',
    extraProperties: {}
  });
  const [selectedRoles, setSelectedRoles] = React.useState<Identity.UserRoleDto[]>([]);
  const [roles, setRoles] = React.useState<Identity.UserRoleDto[]>([]);
  const {errors, validate, getError} = useDataValidator();

  React.useEffect(() => {

    const initData = async () => {

      const rolesRes = await IdentityService.getAssignableRoles();
      setRoles(rolesRes.items);

      if (!id) {
        return;
      }
  
      const userRes = await IdentityService.getUserById(id);

      setSelectedRoles(userRes.roles);
      setData({
        userName: userRes.userName || '',
        name: userRes.name || '',
        email: userRes.email || '',
        phoneNumber: userRes.phoneNumber || '',
        roleNames: userRes.roles?.map(x => x.name) || [],
        password: '',
        extraProperties: {}
      });
    };

    initData();
  }, [id]);

  React.useEffect(() => {
    const dto = {...data};
    dto.roleNames = selectedRoles.map(x => x.name);
    console.log({dto});
    ActionModal.setData({
      data: dto,
      error: errors.length > 0 ? {
        error: true,
        msg: errors[0].msg
      } : undefined
    });
  }, [data]);

  return (
    <form style={{padding: '20px 0'}}>
      <Container>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            id='create-user-name' 
            label='Tên người dùng' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.name}
            onChange={e => setData(prev => ({...prev, name: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            id='create-user-username' 
            label='Tên đăng nhập' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.userName}
            onChange={e => setData(prev => ({...prev, userName: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            id='create-user-email' 
            label='Email' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.email}
            onChange={e => setData(prev => ({...prev, email: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            id='create-user-phonenumber' 
            label='Số điện thoại' 
            required
            autoComplete='off'
            autoFocus={true}
            style={{width: '40ch'}}
            value={data.phoneNumber}
            onChange={e => setData(prev => ({...prev, phoneNumber: e.target.value}))}
          />
        </Box>
        <Box style={{marginBottom: '10px'}}>
             <Autocomplete
                multiple
                id='create-user-role'
                options={roles}
                size='small'
                getOptionLabel={(option) => option.name}
                value={selectedRoles}
                onChange={(event, newValue) => setSelectedRoles(newValue)}
                getOptionSelected={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='standard'
                    label="Vai trò"
                    placeholder="Chọn vai trò"
                  />
                )}
              />
        </Box>
        <Box style={{marginBottom: '10px'}}>
          <TextField
            id='create-user-password' 
            label='Mật khẩu'
            type={'password'}
            autoComplete='off'
            style={{width: '40ch'}}
            value={data.password}
            onChange={e => setData(prev => ({...prev, password: e.target.value}))}
          />
        </Box>
      </Container>
    </form>
  );
};

export default CreateOrUpdateUserRequest;