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
import { useFetchV2 } from '../hooks';
import CreateOrUpdateCourseRequest from '../components/Modal/CreateOrUpdateCourseRequest';
import ActionModal from '../components/Modal';
import { comparers } from '../appConsts';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/CoursesPage';

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
    await CoursesService.removeCourse({courseId: id.toString()});
    toast(`Xóa khóa học ${api.getCellValue(id, 'name')} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  const onRequestUpdate = async (data: Course.CreateUpdateCourseDto) => {
    await CoursesService.updateCourse({id: id.toString(), data});
    toast('Cập nhật thông tin khóa học thành công', {
      type: toast.TYPE.SUCCESS
    });
    
    reloadCurrentPageData();
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin khóa học này'>
          <IconButton  
            onClick={() => ActionModal.show({
              title: 'Cập nhật thông tin khóa học',
              acceptText: 'Lưu',
              cancelText: 'Hủy',
              component: <CreateOrUpdateCourseRequest id={id.toString()}/>,
              onAccept: onRequestUpdate
            })} 
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      <Tooltip title='Xóa học khóa học này'>
        <IconButton
          onClick={() => ActionModal.show({
            title: `Xác nhận xóa khóa học ${api.getCellValue(id, 'name')}?`,
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

const fetchAPIDebounced = AwesomeDebouncePromise(CoursesService.getAllCourses, 500);


const CoursesPage = () => {

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
    document.title = "2Scool | Quản lý khóa học";
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRequestCreate = async (data: Course.CreateUpdateCourseDto) => {
    await CoursesService.createCourse(data);
    toast('Thêm khóa học thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
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
              onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} 
              searchBarPlaceholder="Tìm kiếm khóa học..."
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
                  onMainButtonClick={() => ActionModal.show({
                    title: 'Thêm khóa học mới',
                    acceptText: 'Lưu',
                    cancelText: 'Hủy',
                    component: <CreateOrUpdateCourseRequest />,
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
                  paginationMode='server'
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

export default CoursesPage;