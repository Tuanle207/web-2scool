import { useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId } from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { Identity } from '../interfaces';
import { IdentityService } from '../api';
import { useDialog, useFetchV2 } from '../hooks';
import CreateOrUpdateRoleRequest from '../components/Modal/CreateOrUpdateRoleRequest';
import UpdateRolePermissionsRequest, { UpdateRolePermissionsRequestProps } from '../components/Modal/UpdateRolePermissionsRequest';
import { comparers, dataGridLocale } from '../appConsts';
import useStyles from '../assets/jss/views/RoleManagement';
import { busyService } from '../services';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const provider: Identity.PermissionProvider = {
    providerName: 'R',
    providerKey: api.getCellValue(id, 'name')?.toString(),
  };

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật vai trò',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateRoleRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    const roleName = api.getCellValue(id, 'name')?.toString().toUpperCase();
    const { result } = await showDialog(null, {
      type: 'default',
      title: 'Xác nhận',
      message: `Xác nhận xóa vai trò ${roleName}?`,
      acceptText: 'Xác nhận'
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true);
      const roleId = id.toString();
      await IdentityService.deleteRoleById(roleId);
      toast.success(`Xóa vai trò ${roleName} thành công!`);
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể xóa vai trò.');
    } finally {
      busyService.busy(false);
    }
  };

  const onRequestUpdate = async () => {
    const input = await initUpdateData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog({editItem: input});
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      const roleId = id.toString();
      await IdentityService.updateRole({id: roleId, data});
      toast.success('Cập nhật vai trò thành công');
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật vai trò');
    } finally {
      busyService.busy(false);
    }

    await IdentityService.updateRole({id: id.toString(), data});
    toast('Cập nhật thông tin vai trò thành công', {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  const onRequestPermissionsUpdate = async () => {
    const input = await initUpdateRolePermissionData();
    if (!input) {
      return;
    }
    const roleName = api.getCellValue(id, 'name')?.toString().toUpperCase();
    const { result, data } = await showDialog(input, {
      type: 'data',
      title: `Cập nhật quyền cho vai trò ${roleName}`,
      acceptText: 'Lưu',
      cancelText: 'Hủy',
      renderFormComponent: UpdateRolePermissionsRequest,
    });
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await IdentityService.updateRolePermissions({ provider, data });
      toast.success(`Cập nhật quyền cho vai trò ${roleName} thành công`);
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật vai trò');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async () => {
    try {
      busyService.busy(true);
      const roleId = id.toString();
      const input = await IdentityService.getRoleById(roleId);
      return input;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu để cập nhật vai trò.');
      return null;
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateRolePermissionData = async () => {
    try {
      busyService.busy(true);
      const permissionMetadata = await IdentityService.getPermissions(provider);
      const input: UpdateRolePermissionsRequestProps = {
        permissionMetadata,
      };
      return input;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu để cập nhật vai trò.');
      return null;
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin vai trò này'>
        <IconButton size="small" onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa vai trò này'>
        <IconButton size="small" onClick={onRequestDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Thay đổi quyền cho vai trò này'>
        <IconButton size="small" onClick={onRequestPermissionsUpdate}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const cols: GridColDef[] =  [
  {
    field: 'name',
    headerName: 'Tên vai trò',
    width: 200,
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    renderCell: RowMenuCell,
    sortable: false,
    width: 120,
    headerAlign: 'left',
    filterable: false,
    disableColumnMenu: true,
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(IdentityService.getAllRoles, 100);

const RoleManagement = () => {

  const classes = useStyles();

  const { showDialog } = useDialog<Identity.CreateUpdateRoleDto>({
    type: 'data',
    title: 'Thêm vai trò mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateRoleRequest
  });

  const { 
    pagingInfo,
    setFilter,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {
    document.title = '2Scool | Quản lý vai trò';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRequestCreate = async () => {
    const { result, data } = await showDialog();
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await IdentityService.createRole(data);
      toast.success('Thêm vai trò thành công');
      resetFilter();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể tạo vai trò mới');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item >
        <Header
          onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })}
          pageName="Quản lý vai trò"
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
              title={`Vai trò`} 
              onMainButtonClick={onRequestCreate}
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
              paginationMode='server'
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

export default RoleManagement;