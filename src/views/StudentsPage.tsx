import React from 'react';
import { Container, Grid, makeStyles, IconButton, Typography, Tooltip } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams } from '@material-ui/data-grid';
import { Student, Class, Identity } from '../common/interfaces';
import { IdentityService, StudentsService } from '../common/api';
import { useFetch, usePagingInfo } from '../hooks';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { formatDate } from '../common/utils/TimeHelper';
import { useSelectedItems } from '../hooks';
import ActionModal from '../components/Modal';
import CreateOrUpdateStudentRequest from '../components/Modal/CreateOrUpdateStudentRequest';
import { comparers } from '../common/appConsts';
import { toast } from 'react-toastify';
import CreateStudentAccountRequest from '../components/Modal/CreateStudentAccountRequest';


const cols: GridColDef[] =  [
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
    field: 'class',
    headerName: 'Lớp',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => (params.value as Class.ClassForStudentDto).name
  },
  {
    field: 'parentPhoneNumber',
    headerName: 'SĐT phụ huynh',
    width: 200
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%', 
    width: '100%',
    '& .MuiDataGrid-iconSeparator': {
      color: theme.palette.divider,
      
      '&:hover': {
        color: theme.palette.common.black
      }
    },
    '& .MuiDataGrid-colCell': {
      // borderRight: '1px solid #303030',
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    }
  }
}));

const StudentsPage = () => {

  const classes = useStyles();

  const {pagingInfo, setPageIndex, setFilter} = usePagingInfo();
  const {loading, data, error, resetCache} = useFetch(
    StudentsService.getAllStudents, 
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 } // DataGrid's start page count from 0, but API count from 1.
  );
  const {selectedItems, reset, changeSelection} = useSelectedItems<Student.StudentDto>();
  
  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page);
  };

  const onRequestDelete = async (id: string) => {
    await StudentsService.removeStudent({id});
    toast(`Xóa học sinh ${id} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
    reset();
  };

  const onRequestCreate = async (data: Student.CreateUpdateStudentDto) => {
    await StudentsService.createStudent(data);
    toast('Thêm học sinh thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const onRequestUpdate = async (data: Student.CreateUpdateStudentDto) => {
    await StudentsService.updateStudent({id: getSelectedItem()!.id, data});
    toast('Cập nhật thông tin học sinh thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const onRequestAccountCreate = async (data: Identity.CreateUpdateUserDto) => {
    await IdentityService.createUser(data);
    toast('Cấp tài khoản thành công', {
      type: toast.TYPE.SUCCESS
    });
  };

  const getSelectedItem = (): Student.StudentDto | null => {
    return selectedItems && selectedItems.length > 0 
      ? selectedItems[selectedItems.length - 1] 
      : null;
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'students'} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} />
          </Grid>
          <Grid item container direction='column' style={{ flexGrow: 1 }}>
            <Grid item>
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
              <Grid container justify='space-between' style={{padding: 10, paddingLeft: 64}}>
                <Grid item>
                  <Typography variant='h6'>Danh sách học sinh</Typography>
                </Grid>
                <Grid item>
                  <Tooltip title='Xóa học sinh này'>
                    <IconButton
                      disabled={selectedItems.length === 0} 
                      onClick={() => ActionModal.show({
                        title: `Xác nhận xóa học sinh: ${getSelectedItem()!.name}?`,
                        onAccept: () => onRequestDelete(getSelectedItem()!.id)
                      })}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Cập nhật thông tin'>
                    <IconButton  
                      disabled={selectedItems.length === 0} 
                      onClick={() => ActionModal.show({
                        title: 'Cập nhật thông tin học sinh',
                        acceptText: 'Lưu',
                        cancelText: 'Hủy',
                        component: <CreateOrUpdateStudentRequest id={getSelectedItem()!.id}/>,
                        onAccept: onRequestUpdate
                      })} 
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Cấp tài khoản'>
                    <IconButton
                      disabled={selectedItems.length === 0} 
                      onClick={() => ActionModal.show({
                        component: <CreateStudentAccountRequest id={getSelectedItem()!.id} />,
                        onAccept: onRequestAccountCreate
                      })}
                    >
                      <PersonAddIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ flexGrow: 1 }}>
              <Container className={classes.root}>
                <DataGrid
                  columns={cols}
                  rows={data.items}
                  pageSize={data.pageSize} 
                  rowCount={data.totalCount}
                  onPageChange={onPageChange}
                  loading={loading}
                  page={pagingInfo.pageIndex}
                  error={error}
                  checkboxSelection
                  paginationMode='server'
                  onRowSelected={changeSelection}
                  selectionModel={selectedItems.map(el => el.id)}
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