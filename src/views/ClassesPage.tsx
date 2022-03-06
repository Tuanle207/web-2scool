import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import PageTitleBar from '../components/PageTitleBar';
import { Class, Grade, Teacher } from '../interfaces';
import { ClassesService, GradesService, DataImportService } from '../api';
import { useFetchV2 } from '../hooks';
import ActionModal from '../components/Modal';
import CreateOrUpdateClassRequest from '../components/Modal/CreateOrUpdateClassRequest';
import { comparers, dataGridLocale } from '../appConsts';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/ClassesPage';
import FilterButton, { IFilterOption } from '../components/FilterButton';

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
    await ClassesService.removeClass({id: id.toString()});
    
    toast(`Xóa lớp học ${api.getCellValue(id, 'name')} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  const onRequestUpdate = async (data: Class.CreateUpdateClassDto) => {
    await ClassesService.updateClass({id: id.toString(), data});
    toast('Cập nhật thông tin lớp học thành công', {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  return (
    <div>
      <Tooltip title='Cập nhật thông tin lớp học này'>
        <IconButton  
          onClick={() => ActionModal.show({
            title: 'Cập nhật thông tin lớp học',
            acceptText: 'Lưu',
            cancelText: 'Hủy',
            component: <CreateOrUpdateClassRequest id={id.toString()}/>,
            onAccept: onRequestUpdate
          })} 
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa lớp học này'>
        <IconButton
          onClick={() => ActionModal.show({
            title: `Xác nhận xóa lớp ${api.getCellValue(id, 'name')}?`,
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

const fetchAPIDebounced = AwesomeDebouncePromise(ClassesService.getAllClasss, 100);

const ClassesPage = () => {

  const classes = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  const [ gradeOptions, setGradeOptions ] = useState<IFilterOption[]>([]);

  const { 
    pagingInfo,
    setFilter,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter
  } = useFetchV2({ fetchFn: fetchAPIDebounced });
  
  useEffect(() => {

    const initFilterData = async () => {
      const { items } = await GradesService.getGradesForSimpleList();
      const options: IFilterOption[] = items.map((el) => ({
        id: el.id,
        label: el.displayName,
        value: el.id
      }));
      setGradeOptions(options);
    };

    initFilterData();

    document.title = '2Scool | Quản lý lớp học';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onGradeFilterChange = (options: IFilterOption[]) => {
    const gradeList = options.map((x) => x.value);
    setFilter({
      key: "GradeId",
      comparison: comparers.In,
      value: gradeList.join(',')
    });
  };

  const onRequestCreate = async (data: Class.CreateUpdateClassDto) => {
    await ClassesService.createClass(data);
    toast('Thêm lớp học thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetFilter();
  };

  const onImportFromExcel = async () => {
    fileRef.current?.click();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files || [];
    if (files.length > 0) {
      const file = files[0];

      ActionModal.show({
        title: 'Xác nhận nhập dữ liệu từ excel',
        onAccept: () => importFromExcel(file),
        onClose: resetFileInput
      });
    }
  };

  const importFromExcel = async (file: File) => {
    try {
      await DataImportService.importClassesData(file);
      toast.success("Nhập từ excel thành công!");
      resetFilter();
    } catch (err) {
      toast.error("Không thành công, đã có lỗi xảy ra");
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
          <Sidebar activeKey={routes.ClassesManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })}
              searchBarPlaceholder="Tìm kiếm lớp học..."
              pageName="Quản lý lớp học"
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
                    title: 'Thêm lớp học mới',
                    acceptText: 'Lưu',
                    cancelText: 'Hủy',
                    component: <CreateOrUpdateClassRequest />,
                    onAccept: onRequestCreate
                  })}
                  onOptionsButtonClick={() => toast('default toast', {
                    type: toast.TYPE.INFO,
                  })}
                  filterComponent={(
                    <>
                      <FilterButton
                        title="Khối"
                        options={gradeOptions}
                        onSelectedOptionsChange={onGradeFilterChange}
                      />
                    </>
                  )}
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

export default ClassesPage;