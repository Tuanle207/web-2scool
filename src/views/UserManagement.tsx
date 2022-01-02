import { useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { Identity } from '../interfaces';
import { IdentityService } from '../api';
import { useFetchV2 } from '../hooks';
import CreateOrUpdateUserRequest from '../components/Modal/CreateOrUpdateUserRequest';
import ActionModal from '../components/Modal';
import { comparers } from '../appConsts';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/UserManagement';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    await IdentityService.deleteUserById(id.toString());
    toast(`Xóa nguời dùng ${api.getCellValue(id, 'name')} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  const onRequestUpdate = async (data: Identity.CreateUpdateUserDto) => {
    await IdentityService.updateUser({id: id.toString(), data});
    toast('Cập nhật thông tin người dùng thành công', {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin người dùng này'>
        <IconButton  
          onClick={() => ActionModal.show({
            title: 'Cập nhật thông tin người dùng',
            acceptText: 'Lưu',
            cancelText: 'Hủy',
            component: <CreateOrUpdateUserRequest id={id.toString()}/>,
            onAccept: onRequestUpdate
          })}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa người dùng này'>
        <IconButton
          onClick={() => ActionModal.show({
            title: `Xác nhận xóa người dùng ${api.getCellValue(id, 'name')}?`,
            onAccept: onRequestDelete
          })}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const cols: GridColDef[] =  [
  {
    field: 'actions',
    headerName: 'Hành động',
    renderCell: RowMenuCell,
    sortable: false,
    width: 150,
    headerAlign: 'left',
    filterable: false,
    align: 'center',
    disableColumnMenu: true,
  },
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
    field: 'role',
    headerName: 'Vai trò',
    width: 200,
    valueFormatter: (params: GridValueFormatterParams) => {
      console.log({params});
      if (params.value) {
        const value = params.value as Identity.RoleForSimpleListDto;
        return value.name;
      }
      
      return '';
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

const fetchAPIDebounced = AwesomeDebouncePromise(IdentityService.getUsers, 500);

const UserManagement = () => {

  const classes = useStyles();

  const { 
    pagingInfo,
    setFilter,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetCache
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {
    document.title = '2Scool | Quản lý người dùng';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRequestCreate = async (data: Identity.CreateUpdateUserDto) => {
    await IdentityService.createUser(data);
    toast('Thêm người dùng thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.UsersManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })}
              searchBarPlaceholder="Tìm kiếm người dùng"
              pageName="Quản lý người dùng"
            />
          </Grid>
          <Grid item container direction='column' style={{ flexGrow: 1 }}>
            <Grid item style={{ 
              backgroundColor: "#e8e8e8", 
              paddingTop: 16, 
              paddingRight: 24, 
              paddingLeft: 24 
            }}
            >
              <Paper variant="outlined" elevation={1}>
                <PageTitleBar 
                  title={`Người dùng`} 
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
              </Paper>
            </Grid>
            <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8' }}>
              <Container className={classes.root}>
                <DataGrid
                  columns={cols}
                  rows={data.items}
                  pageSize={pagingInfo.pageSize} 
                  rowCount={data.totalCount}
                  onPageChange={onPageChange}
                  loading={loading}
                  page={pagingInfo.pageIndex && pagingInfo.pageIndex - 1}
                  error={error}
                  paginationMode="server"
                  hideFooterSelectedRowCount
                  rowsPerPageOptions={[5, 15, 30, 50]}
                  onPageSizeChange={onPageSizeChange}
                  pagination
                  
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