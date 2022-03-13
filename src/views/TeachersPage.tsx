import { ChangeEvent, Fragment, useEffect, useRef } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import { toast } from 'react-toastify';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { formatDate } from '../utils/TimeHelper';
import CreateOrUpdateTeacherRequest, { CreateOrUpdateTeacherRequestProps } from '../components/Modal/CreateOrUpdateTeacherRequest';
import { comparers, dataGridLocale } from '../appConsts';
import { DataImportService, TeachersService } from '../api';
import { routes } from '../routers/routesDictionary';
import { busyService } from '../services';
import { Teacher } from '../interfaces';
import { useDialog, useFetchV2 } from '../hooks';
import useStyles from '../assets/jss/views/TeachersPage';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật thông tin giáo viên',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateTeacherRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    try {
      const teacherId = id.toString();
      const teacherName = api.getCellValue(id, 'name')?.toString().toUpperCase();
      const deleteResult = await showDialog(null, {
        type: 'default',
        title: 'Xác nhận',
        message: `Bạn có chắc muốn xóa giáo viên ${teacherName}?`,
        acceptText: 'Xác nhận'
      });
      const { result } = deleteResult;
      if (result === 'Ok') {
        busyService.busy(true);
        await TeachersService.removeTeacher({ id: teacherId });
        toast.success(`Xóa giáo viên ${teacherName} thành công`);
        reloadCurrentPageData();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể xóa giáo viên');
    } finally {
      busyService.busy(false);
    }
  };

  const onRequestUpdate = async () => {
    const teacher = await initUpdateData();
    if (!teacher) {
      return;
    }
    const input: CreateOrUpdateTeacherRequestProps = { editItem: teacher };
    const editResult = await showDialog(input);
    const { result, data } = editResult;
    if (result !== 'Ok' || !data) {
      return;
    }
    await saveUpdateData(data);
  };
  
  const initUpdateData = async (): Promise<Teacher.TeacherDto | null> => {
    try {
      busyService.busy(true);
      const teacherId = id.toString();
      const teacher = await TeachersService.getTeacherById(teacherId);
      return teacher;
    } catch (err) {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo cập nhật');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  const saveUpdateData = async(data: Teacher.CreateUpdateTeacherDto) => {
    try {
      busyService.busy(true);
      const teacherId = id.toString();
      await TeachersService.updateTeacher({id: teacherId, data});
      toast.success('Cập nhật thông tin giáo viên thành công');
      reloadCurrentPageData();
    } catch (err: any) {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật giáo viên');
    } finally {
      busyService.busy(false);
    }
  }

  return (
    <div>
      <Tooltip title='Cập nhật thông tin giáo viên này'>
        <IconButton onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa giáo viên này'>
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
    field: 'name',
    headerName: 'Tên',
    width: 200
  },
  {
    field: 'dob',
    headerName: 'Ngày sinh',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string)
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200
  },
  {
    field: 'phoneNumber',
    headerName: 'Số điện thoại',
    width: 150
  }
];

const fetchAPIDebounced = AwesomeDebouncePromise(TeachersService.getAllTeachers, 100);

const TeachersPage = () => {

  const classes = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Thêm giáo viên mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateTeacherRequest
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
    getFilterCount,
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {
    document.title = '2Scool | Quản lý giáo viên';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRequestCreate = async () => {
    try {
      const editResult = await showDialog();
      const { result, data } = editResult;
      if (result === 'Ok' && data) {
        busyService.busy(true);
        await TeachersService.createTeacher(data);
        toast.success('Thêm giáo viên thành công');
        resetFilter();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể thêm khóa học');
    } finally {
      busyService.busy(false);
    }
  };

  const onImportFromExcel = async () => {
    fileRef.current?.click();
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files || [];
    if (files.length === 0) {
      return;
    }
    const { result } = await showDialog(null, {
      type: 'default',
      acceptText: 'Xác nhận',
      title: 'Xác nhận',
      message: 'Xác nhận nhập dữ liệu từ excel'
    })
    if (result !== 'Ok') {
      resetFileInput();
      return;
    }
    const file = files[0];
    await importFromExcel(file);
    resetFileInput();
  };

  const importFromExcel = async (file: File) => {
    try {
      busyService.busy(true);
      await DataImportService.importTeachersData(file);
      toast.success("Nhập từ excel thành công!");
      resetFilter();
    } catch (err) {
      toast.error("Không thành công, đã có lỗi xảy ra");
    } finally {
      busyService.busy(false);
    }
  };

  const resetFileInput = () => {
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.TeachersManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })}
              searchBarPlaceholder="Tìm kiếm giáo viên..."
              pageName="Quản lý giáo viên"
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
                  filterCount={getFilterCount()}
                  actionComponent={(
                    <Fragment>
                      <Tooltip title="Nhập từ excel">
                        <IconButton style={{ marginRight: 16 }} size="small" onClick={onImportFromExcel}>
                          <PublishIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Fragment>
                  )}
                />
              </Paper>
            </Grid>
            <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8' }}>
              <Container className={classes.root}>
                <input ref={fileRef} hidden type="file" onChange={onFileChange} /> 
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
      </Grid>
    </div>
    
  );
};

export default TeachersPage;