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
import { Course } from '../interfaces';
import { CoursesService } from '../api';
import { formatDate } from '../utils/TimeHelper';
import { useDialog, useFetchV2 } from '../hooks';
import CreateOrUpdateCourseRequest from '../components/Modal/CreateOrUpdateCourseRequest';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/CoursesPage';
import { dataGridLocale } from '../appConsts';
import { busyService } from '../services';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog<Course.CreateUpdateCourseDto>({
    type: 'data',
    title: 'Cập nhật thông tin khóa học',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateCourseRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    try {
      const courseId = id.toString();
      const courseName = api.getCellValue(id, 'name')?.toString().toUpperCase();
      const deleteResult = await showDialog(null, {
        type: 'default',
        title: 'Xác nhận',
        message: `Bạn có chắc muốn xóa khóa học ${courseName}?`,
        acceptText: 'Xác nhận'
      });
      const { result } = deleteResult;
      if (result === 'Ok') {
        busyService.busy(true);
        await CoursesService.removeCourse({ courseId });
        toast(`Xóa khóa học ${courseName} thành công`, {
          type: toast.TYPE.SUCCESS
        });
        reloadCurrentPageData();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể xóa khóa học');
    } finally {
      busyService.busy(false);
    }
  };

  const onRequestUpdate = async () => {
    try {
      busyService.busy(true);
      const courseId = id.toString();
      const course = await CoursesService.getCourseById(courseId);
      busyService.busy(false);
      const editResult = await showDialog({ editItem: course });
      const { result, data } = editResult;
      if (result === 'Ok' && data) {
        busyService.busy(true);
        await CoursesService.updateCourse({id: courseId, data});
        toast('Cập nhật thông tin khóa học thành công', {
          type: toast.TYPE.SUCCESS
        });
        reloadCurrentPageData();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể cập nhật khóa học');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin khóa học này'>
          <IconButton  
            onClick={onRequestUpdate} 
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      <Tooltip title='Xóa học khóa học này'>
        <IconButton
          onClick={onRequestDelete}
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
    headerName: 'Tên khóa học',
    width: 300
  },
  {
    field: 'startTime',
    headerName: 'Ngày bắt đầu',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string)
  },
  {
    field: 'finishTime',
    headerName: 'Ngày kết thúc',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string)
  }
];

const fetchAPIDebounced = AwesomeDebouncePromise(CoursesService.getAllCourses, 100);


const CoursesPage = () => {

  const classes = useStyles();

  const { 
    pagingInfo,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  const { showDialog } = useDialog<Course.CreateUpdateCourseDto>({
    type: 'data',
    title: 'Thêm khóa học mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateCourseRequest
  });
  
  useEffect(() => {
    document.title = "2Scool | Quản lý khóa học";
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRequestCreate = async () => {
    const editResult = await showDialog();
    const { result, data } = editResult;
    if (result !== 'Ok' || !data) {
      return;
    } 
    try {
      busyService.busy(true);
      await CoursesService.createCourse(data);
      toast('Thêm khóa học thành công', {
        type: toast.TYPE.SUCCESS
      });
      resetFilter();
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể thêm khóa học');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.CoursesManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              hiddenSearchBar
              pageName="Quản lý khóa học"
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
                  title={`Khóa học`} 
                  onMainButtonClick={onRequestCreate}
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

export default CoursesPage;