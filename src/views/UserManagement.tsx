import { useState, useEffect, Fragment, } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import { Identity } from '../interfaces';
import { IdentityService } from '../api';
import { useFetchV2, useDialog, usePermissionChecker } from '../hooks';
import CreateOrUpdateUserRequest, { CreateOrUpdateUserRequestProps, CreateUpdateUserFormValues } from '../components/Modal/CreateOrUpdateUserRequest';
import { comparers, dataGridLocale, policies } from '../appConsts';
import { busyService } from '../services';
import useStyles from '../assets/jss/views/UserManagement';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog<CreateUpdateUserFormValues>({
    type: 'data',
    title: 'Cập nhật tài khoản người dùng',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateUserRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    const userName = api.getCellValue(id, 'name')?.toString().toUpperCase();
    const { result } = await showDialog(null, {
      type: 'default',
      title: 'Xác nhận',
      message: `Xác nhận xóa tài khoản của người dùng ${userName}?`,
      acceptText: 'Xác nhận'
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true);
      const userId = id.toString();
      await IdentityService.deleteUserById(userId);
      toast.success(`Xóa nguời dùng ${userName} thành công!`);
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể xóa tài khoản.');
    } finally {
      busyService.busy(false);
    }
  };

  const onRequestUpdate = async () => {
    const input = await initUpdateData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input);
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      const userId = id.toString();
      const dataCopy = {...data, roles: undefined};
      const user: Identity.CreateUpdateUserDto = { ...dataCopy };
      await IdentityService.updateUser({id: userId, data: user});
      toast.success('Cập nhật thông tin tài khoản người dùng thành công');
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật tài khoản người dùng.');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async () => {
    try {
      busyService.busy(true);
      const { items } = await IdentityService.getAssignableRoles();
      const userId = id.toString();
      const user = await IdentityService.getUserById(userId);
      const input: CreateOrUpdateUserRequestProps = {
        assignableRoles: items,
        editItem: user,
      };
      return input;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu để cập nhật tài khoản.');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  return (
    <div>
      <Tooltip title='Cập nhật thông tin người dùng này'>
        <IconButton size="small" onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa người dùng này'>
        <IconButton size="small" onClick={onRequestDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const cols: GridColDef[] =  [
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
      if (params.value) {
        const value = params.value as Identity.RoleForSimpleListDto[];
        return value.map(x => x.name).join(', ');
      }
      
      return '';
    }
  },
  {
    field: 'email',
    headerName: 'Email đăng nhập',
    width: 200,
  },
  {
    field: 'phoneNumber',
    headerName: 'Số điện thoại',
    width: 150,
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    renderCell: RowMenuCell,
    sortable: false,
    width: 130,
    headerAlign: 'left',
    filterable: false,
    disableColumnMenu: true,
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(IdentityService.getUsers, 100);

const UserManagement = () => {

  const classes = useStyles();

  const canCreateUser = usePermissionChecker(policies.AbpIdentityUsersCreate);

  const { showDialog } = useDialog<CreateUpdateUserFormValues>({
    type: 'data',
    title: 'Thêm tài khoản người dùng mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateUserRequest
  });

  const [ roleOptions, setRoleOptions ] = useState<IFilterOption[]>([]);

  const { 
    pagingInfo,
    setFilter,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter,
    getFilterCount
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {
    const initFilterData = async () => {
      const { items: roleItems } = await IdentityService.getAssignableRoles();
      const roleOptions: IFilterOption[] = roleItems.map((el) => ({
        id: el.id,
        label: el.name,
        value: el.id
      }));
      setRoleOptions(roleOptions);
    };

    initFilterData();
    document.title = '2Scool | Quản lý người dùng';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRoleFilterChange = (options: IFilterOption[]) => {
    const roleIdList = options.map((x) => x.value);
    setFilter({
      key: "RoleId",
      comparison: comparers.In,
      value: roleIdList.join(',')
    });
  };

  const onRequestCreate = async () => {
    const input = await initCreationData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input);
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      const dataCopy = {...data, roles: undefined};
      const user: Identity.CreateUpdateUserDto = { ...dataCopy };
      await IdentityService.createUser(user);
      toast.success('Thêm tài khoản người dùng thành công');
      resetFilter();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể tạo tài khoản người dùng.');
    } finally {
      busyService.busy(false);
    }
  };

  const initCreationData = async () => {
    try {
      busyService.busy(true);
      const { items } = await IdentityService.getAssignableRoles();
      const input: CreateOrUpdateUserRequestProps = {
        assignableRoles: items,
      };
      return input;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu để tạo tài khoản');
      return null;
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
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
              filterCount={getFilterCount()}
              filterComponent={(
                <Fragment>
                  <FilterButton
                    title="Vai trò"
                    options={roleOptions}
                    onSelectedOptionsChange={onRoleFilterChange}
                  />
                </Fragment>
              )}
              onMainButtonClick={canCreateUser ? onRequestCreate : undefined}
            />
          </Paper>
        </Grid>
        <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8' }}>
          <Container className={classes.root}>
            <DataGrid
              columns={cols}
              rows={data.items.filter(x => x.roles.every(c => c.name !== 'admin'))}
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
              localeText={dataGridLocale}
            />
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserManagement;