import React from 'react';
import { Container, Grid, makeStyles, IconButton, Typography } from '@material-ui/core';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams } from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { Course, Identity } from '../common/interfaces';
import { IdentityService } from '../common/api';
import { useFetch, usePagingInfo } from '../hooks';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { formatDate } from '../common/utils/TimeHelper';
import { useSelectedItems } from '../hooks';
import CreateOrUpdateUserRequest from '../components/Modal/CreateOrUpdateUserRequest';
import ActionModal from '../components/Modal';
import { comparers } from '../common/appConsts';


const cols: GridColDef[] =  [
  {
    field: 'id',
    headerName: 'Mã',
    width: 150
  },
  {
    field: 'name',
    headerName: 'Họ tên',
    width: 150,
  },
  {
    field: 'roles',
    headerName: 'Vai trò',
    width: 200,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as Identity.UserRoleDto[];
      if (value && value.length >= 0) {
        return value.map(x => x.name).join(', ');
      } else {
        return '';
      }
    }
  },
  {
    field: 'userName',
    headerName: 'Tên đăng nhập',
    width: 150
  },
  {
    field: 'email',
    headerName: 'Email đăng nhập',
    width: 150,
  },
  {
    field: 'phoneNumber',
    headerName: 'Số điện thoại',
    width: 150,
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    '& .MuiDataGrid-iconSeparator': {
      color: theme.palette.divider,
      
      '&:hover': {
        color: theme.palette.common.black
      }
    },
    '& .MuiDataGrid-colCell': {
      // borderRight: '1px solid #303030',
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    }
  }
}));

const UserManagement = () => {

  const classes = useStyles();

  const {pagingInfo, setPageIndex, setFilter} = usePagingInfo();
  const {loading, data, error, resetCache} = useFetch(
    IdentityService.getUsers,
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 } // DataGrid's start page count from 0, but API count from 1.
  );
  const {selectedItems, reset, changeSelection} = useSelectedItems<Identity.UserDto>();
  
  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page);
  };

  const onRequestDelete = async (courseId: string) => {
    await IdentityService.deleteUserById(getSelectedItem()!.id);
    toast(`Xóa nguời dùng thành công`, {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
    reset();
  };

  const onRequestCreate = async (data: Identity.CreateUpdateUserDto) => {
    await IdentityService.createUser(data);
    toast('Thêm người dùng thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const onRequestUpdate = async (data: Identity.CreateUpdateUserDto) => {
    await IdentityService.updateUser({id: getSelectedItem()!.id, data});
    toast('Cập nhật thông tin người dùng thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const getSelectedItem = (): Identity.RoleDto | null => {
    return selectedItems && selectedItems.length > 0 
      ? selectedItems[selectedItems.length - 1] 
      : null;
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'users'} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} />
          </Grid>
          <Grid item container direction='column' style={{ flexGrow: 1 }}>
            <Grid item>
              <PageTitleBar 
                title={`Khóa học`} 
                onMainButtonClick={() => ActionModal.show({
                  title: 'Thêm người dùng mới',
                  acceptText: 'Lưu',
                  cancelText: 'Hủy',
                  component: <CreateOrUpdateUserRequest />,
                  onAccept: onRequestCreate
                })}
                onOptionsButtonClick={() => toast('default toast', {
                  type: toast.TYPE.INFO,
                })}
              />
              <Grid container justify='space-between' style={{padding: 10, paddingLeft: 64}}>
                <Grid item>
                  <Typography variant='h6'>Danh sách người dùng</Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={selectedItems.length === 0} 
                    onClick={() => ActionModal.show({
                      title: `Xác nhận xóa người dùng: ${getSelectedItem()!.name}?`,
                      onAccept: () => onRequestDelete(getSelectedItem()!.id)
                    })}
                  >
                    <DeleteIcon/>
                  </IconButton>
                  <IconButton  
                    disabled={selectedItems.length === 0} 
                    onClick={() => ActionModal.show({
                      title: 'Cập nhật thông tin người dùng',
                      acceptText: 'Lưu',
                      cancelText: 'Hủy',
                      component: <CreateOrUpdateUserRequest id={getSelectedItem()!.id}/>,
                      onAccept: onRequestUpdate
                    })} 
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={selectedItems.length === 0} 
                    // onClick={} 
                  >
                    <ErrorOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Container className={classes.root}>
                <DataGrid
                  columns={cols}
                  rows={data.items}
                  pageSize={data.pageSize} 
                  rowCount={data.totalCount}
                  onPageChange={onPageChange}
                  loading={loading}
                  page={pagingInfo.pageIndex}
                  error={error}
                  checkboxSelection
                  paginationMode='server'
                  onRowSelected={changeSelection}
                  selectionModel={selectedItems.map(el => el.id)}
                />
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    
  );
};

export default UserManagement;