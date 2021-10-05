import React from 'react';
import { Container, Grid, makeStyles, IconButton, Typography } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams } from '@material-ui/data-grid';
import { Class, Grade, Teacher } from '../common/interfaces';
import { ClassesService } from '../common/api';
import { useFetch, usePagingInfo } from '../hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { formatDate } from '../common/utils/TimeHelper';
import { useSelectedItems } from '../hooks';
import ActionModal from '../components/Modal';
import CreateOrUpdateClassRequest from '../components/Modal/CreateOrUpdateClassRequest';
import { comparers } from '../common/appConsts';
import { toast } from 'react-toastify';


const cols: GridColDef[] =  [
  {
    field: 'id',
    headerName: 'Mã',
    width: 150
  },
  {
    field: 'name',
    headerName: 'Tên lớp',
    width: 150
  },
  {
    field: 'grade',
    headerName: 'Khối',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => (params.value as Grade.GradeDto).displayName as string
  },
  {
    field: 'formTeacher',
    headerName: 'Giáo viên chủ nhiệm',
    width: 200,
    valueFormatter: (params: GridValueFormatterParams) => (params.value as Teacher.TeacherDto).name as string
  },
  {
    field: 'noStudents',
    headerName: 'Sĩ số',
    width: 200
  },
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

const ClassesPage = () => {

  const classes = useStyles();

  const {pagingInfo, setPageIndex, setFilter} = usePagingInfo();
  const {loading, data, error, resetCache} = useFetch(
    ClassesService.getAllClasss, 
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 } // DataGrid's start page count from 0, but API count from 1.
  );
  const {selectedItems, reset, changeSelection} = useSelectedItems<Class.ClassDto>();
  
  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page);
  };

  const onRequestDelete = async (id: string) => {
    await ClassesService.removeClass({id});
    toast(`Xóa lớp học ${id} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
    reset();
  };

  const onRequestCreate = async (data: Class.CreateUpdateClassDto) => {
    await ClassesService.createClass(data);
    toast('Thêm lớp học thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const onRequestUpdate = async (data: Class.CreateUpdateClassDto) => {
    await ClassesService.updateClass({id: getSelectedItem()!.id, data});
    toast('Cập nhật thông tin lớp học thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const getSelectedItem = (): Class.ClassDto | null => {
    return selectedItems && selectedItems.length > 0 
      ? selectedItems[selectedItems.length - 1] 
      : null;
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'classes'} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} />
          </Grid>
          <Grid item container direction='column' style={{ flexGrow: 1 }}>
            <Grid item>
              <PageTitleBar 
                title={`Lớp học`} 
                onMainButtonClick={() => ActionModal.show({
                  title: 'Thêm lớp học mới',
                  acceptText: 'Lưu',
                  cancelText: 'Hủy',
                  component: <CreateOrUpdateClassRequest />,
                  onAccept: onRequestCreate
                })}
                onOptionsButtonClick={() => toast('default toast', {
                  type: toast.TYPE.INFO,
                })}
              />
              <Grid container justify='space-between' style={{padding: 10, paddingLeft: 64}}>
                <Grid item>
                  <Typography variant='h6'>Danh sách lớp học</Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={selectedItems.length === 0} 
                    onClick={() => ActionModal.show({
                      title: `Xác nhận xóa lớp học: ${getSelectedItem()!.name}?`,
                      onAccept: () => onRequestDelete(getSelectedItem()!.id)
                    })}
                  >
                    <DeleteIcon/>
                  </IconButton>
                  <IconButton  
                    disabled={selectedItems.length === 0} 
                    onClick={() => ActionModal.show({
                      title: 'Cập nhật thông tin lớp học',
                      acceptText: 'Lưu',
                      cancelText: 'Hủy',
                      component: <CreateOrUpdateClassRequest id={getSelectedItem()!.id}/>,
                      onAccept: onRequestUpdate
                    })} 
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={selectedItems.length === 0} 
                    // onClick={} 
                  >
                    <ErrorOutlineIcon />
                  </IconButton>
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

export default ClassesPage;