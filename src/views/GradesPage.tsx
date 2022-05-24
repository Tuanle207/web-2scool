import { useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { Grade } from '../interfaces';
import { GradesService } from '../api';
import { useDialog, useFetchV2 } from '../hooks';
import CreateOrUpdateGradeRequest,  { CreateOrUpdateGradeRequestProps } from '../components/Modal/CreateOrUpdateGradeRequest';
import { dataGridLocale } from '../appConsts';
import useStyles from '../assets/jss/views/GradesPage';
import { busyService } from '../services';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật thông tin khối',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateGradeRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    const gradeName = api.getCellValue(id, 'displayName')?.toString().toUpperCase();
    const { result } = await showDialog(null, {
      type: 'default',
      title: 'Xác nhận',
      message: `Xác nhận xóa khối ${gradeName}?`,
      acceptText: 'Xác nhận'
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true);
      const gradeId = id.toString();
      await GradesService.deleteGradeById(gradeId);
      toast.success(`Xóa khối ${gradeName} thành công`);
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể xóa khối');
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
      const gradeId = id.toString();
      await GradesService.updateGrade({id: gradeId, data});
      toast.success('Cập nhật thông tin khối thành công');
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật khối');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async () => {
    try {
      busyService.busy(true);
      const gradeId = id.toString();
      const data = await GradesService.getGradeById(gradeId);
      const result: CreateOrUpdateGradeRequestProps = {
        editItem: data
      };
      return result;

    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể tạo dữ liệu cập nhật');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  return (
    <div>
      <Tooltip title='Cập nhật thông tin khối này'>
        <IconButton onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa khối này'>
        <IconButton onClick={onRequestDelete}>
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
    field: 'displayName',
    headerName: 'Tên',
    width: 200
  },
  {
    field: 'description',
    headerName: 'Mô tả',
    width: 200
  }
];

const fetchAPIDebounced = AwesomeDebouncePromise(GradesService.getAllGrades, 100);

const GradesPage = () => {

  const classes = useStyles();

  const { showDialog } = useDialog<Grade.CreateUpdateGradeDto>({
    type: 'data',
    title: 'Thêm khối mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateGradeRequest
  });

  const { 
    pagingInfo,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {
    document.title = "2Scool | Quản lý khối";
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
      await GradesService.createGrade(data);
      toast.success('Thêm khối thành công');
      resetFilter();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể tạo khối mới');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item >
        <Header
          hiddenSearchBar
          pageName="Quản lý khối"
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
              title={`Giáo viên`} 
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

export default GradesPage;