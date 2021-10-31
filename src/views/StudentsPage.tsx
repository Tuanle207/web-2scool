import { useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams,
  GridApi, GridRowId } from '@material-ui/data-grid';
import { Student, Class, Identity } from '../interfaces';
import { IdentityService, StudentsService } from '../api';
import { useFetchV2 } from '../hooks/useFetchV2';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { formatDate } from '../utils/TimeHelper';
import ActionModal from '../components/Modal';
import CreateOrUpdateStudentRequest from '../components/Modal/CreateOrUpdateStudentRequest';
import { comparers } from '../appConsts';
import { toast } from 'react-toastify';
import CreateStudentAccountRequest from '../components/Modal/CreateStudentAccountRequest';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/StudentsPage';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestUpdate = async (data: Student.CreateUpdateStudentDto) => {
    await StudentsService.updateStudent({id: id.toString(), data});
    toast('Cập nhật thông tin học sinh thành công', {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  const onRequestAccountCreate = async (data: Identity.CreateUpdateUserDto) => {
    await IdentityService.createUser(data);
    toast('Cấp tài khoản thành công', {
      type: toast.TYPE.SUCCESS
    });
  };

  const onRequestDelete = async () => {
    await StudentsService.removeStudent({id: id.toString()});
    toast(`Xóa học sinh ${api.getCellValue(id, 'name')} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin học sinh này'>
          <IconButton  
            onClick={() => ActionModal.show({
              title: 'Cập nhật thông tin học sinh',
              acceptText: 'Lưu',
              cancelText: 'Hủy',
              component: <CreateOrUpdateStudentRequest id={id.toString()}/>,
              onAccept: onRequestUpdate
            })} 
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      <Tooltip title='Cấp tài khoản cho học sinh này'>
        <IconButton
          onClick={() => ActionModal.show({
            title: "Cấp tài khoản cho học sinh",
            acceptText: "Cấp tài khoản",
            component: <CreateStudentAccountRequest id={id.toString()} />,
            onAccept: onRequestAccountCreate
          })}
        >
          <PersonAddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa học sinh này'>
        <IconButton
          onClick={() => ActionModal.show({
            title: `Xác nhận xóa học sinh ${api.getCellValue(id, 'name')}?`,
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
    width: 120
  },
  {
    field: 'name',
    headerName: 'Tên',
    width: 200
  },
  {
    field: 'dob',
    headerName: 'Ngày sinh',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => formatDate(params.value as string)
  },
  {
    field: 'class',
    headerName: 'Lớp',
    width: 120,
    valueFormatter: (params: GridValueFormatterParams) => (params.value as Class.ClassForStudentDto).name
  },
  {
    field: 'parentPhoneNumber',
    headerName: 'SĐT phụ huynh',
    width: 150
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(StudentsService.getAllStudents, 500);

const StudentsPage = () => {

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
    document.title = '2Scool | Quản lý học sinh';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onRequestCreate = async (data: Student.CreateUpdateStudentDto) => {
    await StudentsService.createStudent(data);
    toast('Thêm học sinh thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.StudentsManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              searchBarPlaceholder="Tìm kiếm học sinh..."
              onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} 
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
                  title={`Học sinh`} 
                  onMainButtonClick={() => ActionModal.show({
                    title: 'Thêm học sinh mới',
                    acceptText: 'Lưu',
                    cancelText: 'Hủy',
                    component: <CreateOrUpdateStudentRequest />,
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

export default StudentsPage;