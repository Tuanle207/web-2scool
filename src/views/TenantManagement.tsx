import { useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { Tenant } from '../interfaces';
import { MultitenancyService } from '../api';
import { useFetchV2, useDialog } from '../hooks';
import { comparers, dataGridLocale, tenantSettingType } from '../appConsts';
import { busyService } from '../services';
import UpdateTenantRequest, { UpdateTenantRequestProps, UpdateTenantFormData } from '../components/Modal/UpdateTenantRequest';
import CreateTenantRequest, { CreateTenantFormData } from '../components/Modal/CreateTenantRequest';
import { formatTime } from '../utils/TimeHelper';
import useStyles from '../assets/jss/views/UserManagement';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật khách thuê',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: UpdateTenantRequest,
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    const tenantName = api.getCellValue(id, 'name')?.toString().toUpperCase();
    const { result } = await showDialog(null, {
      type: 'default',
      title: 'Xác nhận',
      message: `Xác nhận xóa khách thuê ${tenantName}?`,
      acceptText: 'Xác nhận'
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true);
      const tenantId = id.toString();
      await MultitenancyService.deleteTenantById(tenantId);
      toast.success(`Xóa khách thuê ${tenantName} thành công!`);
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể xóa khách thuê.');
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
      const tenantId = id.toString();
      const { name, displayName } = data as UpdateTenantFormData;
      const tenant: Tenant.UpdateTenantDto = {
        name,
        extraProperties: {
          [tenantSettingType.DisplayName]: displayName
        },
      };
      await MultitenancyService.updateTenant({id: tenantId, data: tenant});
      toast.success('Cập nhật thông tin khách thuê thành công');
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật khách thuê.');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async () => {
    try {
      busyService.busy(true);
      const tenantId = id.toString();
      const tenant = await MultitenancyService.getTenantById(tenantId);
      const input: UpdateTenantRequestProps = {
        id: tenantId,
        initName: tenant.name,
        initDisplayName: tenant.extraProperties[tenantSettingType.DisplayName],
      };
      return input;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu để cập nhật khách thuê.');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  return (
    <div>
      <Tooltip title='Cập nhật thông tin khách thuê này'>
        <IconButton onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa khách thuê này'>
        <IconButton onClick={onRequestDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const cols: GridColDef[] =  [
  {
    field: 'name',
    headerName: 'Tên khách thuê',
    width: 250,
  },
  {
    field: 'displayName',
    headerName: 'Tên hiển thị',
    width: 300,
  },
  {
    field: 'creationTime',
    headerName: 'Ngày tạo',
    width: 300,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as string;
      return value ? formatTime(value) : '';
    }
  },
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
];

const fetchAPIDebounced = AwesomeDebouncePromise(MultitenancyService.getTenants, 100);

const TenantManagement = () => {

  const classes = useStyles();

  const { showDialog } = useDialog<CreateTenantFormData>({
    type: 'data',
    title: 'Thêm khách thuê mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateTenantRequest
  });

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
    document.title = '2Scool | Quản lý khách thuê';
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
      const { name, displayName, adminEmailAddress, adminPassword } = data;
      const tenant: Tenant.CreateTenantDto = {
        name,
        adminEmailAddress,
        adminPassword,
        extraProperties: {
          [tenantSettingType.DisplayName]: displayName,
        },
      };
      await MultitenancyService.createTenant(tenant);
      toast.success('Thêm khách thuê thành công');
      resetFilter();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể tạo khách thuê.');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item >
        <Header
          onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })}
          searchBarPlaceholder="Tìm kiếm khách thuê"
          pageName="Quản lý khách thuê"
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
              title={`Khách thuê`}
              filterCount={getFilterCount()}
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

export default TenantManagement;