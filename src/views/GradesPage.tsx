import React from 'react';
import { Container, Grid, makeStyles, IconButton, Typography } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams } from '@material-ui/data-grid';
import { Grade } from '../common/interfaces';
import { GradesService } from '../common/api';
import { useFetch, usePagingInfo } from '../hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { formatDate } from '../common/utils/TimeHelper';
import { useSelectedItems } from '../hooks';
import ActionModal from '../components/Modal';
import CreateOrUpdateGradeRequest from '../components/Modal/CreateOrUpdateGradeRequest';
import { comparers } from '../common/appConsts';
import { toast } from 'react-toastify';


const cols: GridColDef[] =  [
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

const GradesPage = () => {

  const classes = useStyles();

  const {pagingInfo, setPageIndex, setFilter} = usePagingInfo();
  const {loading, data, error, resetCache} = useFetch(
    GradesService.getAllGrades, 
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 } // DataGrid's start page count from 0, but API count from 1.
  );
  const {selectedItems, reset, changeSelection} = useSelectedItems<Grade.GradeDto>();
  
  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page);
  };

  const onRequestDelete = async (id: string) => {
    await GradesService.removeGrade({id});
    toast(`Xóa khối ${id} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
    reset();
  };

  const onRequestCreate = async (data: Grade.CreateUpdateGradeDto) => {
    await GradesService.createGrade(data);
    toast('Thêm khối thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const onRequestUpdate = async (data: Grade.CreateUpdateGradeDto) => {
    await GradesService.updateGrade({id: getSelectedItem()!.id, data});
    toast('Cập nhật thông tin khối thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  const getSelectedItem = (): Grade.GradeDto | null => {
    return selectedItems && selectedItems.length > 0 
      ? selectedItems[selectedItems.length - 1] 
      : null;
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'grades'} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} />
          </Grid>
          <Grid item container direction='column' style={{ flexGrow: 1 }}>
            <Grid item>
              <PageTitleBar 
                title={`Khối`} 
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
              <Grid container justify='space-between' style={{padding: 10, paddingLeft: 64}}>
                <Grid item>
                  <Typography variant='h6'>Danh sách khối</Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={selectedItems.length === 0} 
                    onClick={() => ActionModal.show({
                      title: `Xác nhận xóa khối: ${getSelectedItem()!.name}?`,
                      onAccept: () => onRequestDelete(getSelectedItem()!.id)
                    })}
                  >
                    <DeleteIcon/>
                  </IconButton>
                  <IconButton  
                    disabled={selectedItems.length === 0} 
                    onClick={() => ActionModal.show({
                      title: 'Cập nhật thông tin khối',
                      acceptText: 'Lưu',
                      cancelText: 'Hủy',
                      component: <CreateOrUpdateGradeRequest id={getSelectedItem()!.id}/>,
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

export default GradesPage;