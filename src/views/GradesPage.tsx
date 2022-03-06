import { useEffect } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId } from '@material-ui/data-grid';
import { Grade } from '../interfaces';
import { GradesService } from '../api';
import { useFetchV2 } from '../hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ActionModal from '../components/Modal';
import CreateOrUpdateGradeRequest from '../components/Modal/CreateOrUpdateGradeRequest';
import { toast } from 'react-toastify';
import { routes } from '../routers/routesDictionary';
import { dataGridLocale } from '../appConsts';
import useStyles from '../assets/jss/views/GradesPage';

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
    await GradesService.removeGrade({id: id.toString()});
    toast(`Xóa khối ${api.getCellValue(id, 'name')} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  const onRequestUpdate = async (data: Grade.CreateUpdateGradeDto) => {
    await GradesService.updateGrade({id: id.toString(), data});
    toast('Cập nhật thông tin khối thành công', {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin khối này'>
        <IconButton  
          onClick={() => ActionModal.show({
            title: 'Cập nhật thông tin khối',
            acceptText: 'Lưu',
            cancelText: 'Hủy',
            component: <CreateOrUpdateGradeRequest id={id.toString()}/>,
            onAccept: onRequestUpdate
          })} 
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa khối này'>
        <IconButton
          onClick={() => ActionModal.show({
            title: `Xác nhận xóa khối ${api.getCellValue(id, 'name')}?`,
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

  const onRequestCreate = async (data: Grade.CreateUpdateGradeDto) => {
    await GradesService.createGrade(data);
    toast('Thêm khối thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetFilter();
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.GradesManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
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
                  onMainButtonClick={() => ActionModal.show({
                    title: 'Thêm khối mới',
                    acceptText: 'Lưu',
                    cancelText: 'Hủy',
                    component: <CreateOrUpdateGradeRequest />,
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

export default GradesPage;