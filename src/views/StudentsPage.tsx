import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams,
  GridApi, GridRowId } from '@material-ui/data-grid';
import { Student, Class, Identity } from '../interfaces';
import { ClassesService, IdentityService, StudentsService, GradesService, DataImportService } from '../api';
import { useFetchV2 } from '../hooks/useFetchV2';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import { formatDate } from '../utils/TimeHelper';
import ActionModal from '../components/Modal';
import { comparers, dataGridLocale } from '../appConsts';
import { toast } from 'react-toastify';
import CreateOrUpdateStudentRequest from '../components/Modal/CreateOrUpdateStudentRequest';
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

const fetchAPIDebounced = AwesomeDebouncePromise(StudentsService.getAllStudents, 100);

const StudentsPage = () => {

  const classes = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  const [ classOptions, setClassOptions ] = useState<IFilterOption[]>([]);
  const [ gradeOptions, setGradeOptions ] = useState<IFilterOption[]>([]);

  const { 
    pagingInfo,
    setFilter,
    getFilterCount,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {

    const initFilterData = async () => {
      const { items: classItems } = await ClassesService.getClassForSimpleList();
      const { items: gradeItems } = await GradesService.getGradesForSimpleList();
      const classOptions: IFilterOption[] = classItems.map((el) => ({
        id: el.id,
        label: el.name,
        value: el.id
      }));
      const gradeOptions: IFilterOption[] = gradeItems.map((el) => ({
        id: el.id,
        label: el.displayName,
        value: el.id
      }));
      setClassOptions(classOptions);
      setGradeOptions(gradeOptions);
    };

    initFilterData();

    document.title = '2Scool | Quản lý học sinh';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onClassFilterChange = (options: IFilterOption[]) => {
    const classIdList = options.map((x) => x.id);
    setFilter({
      key: "ClassId",
      comparison: comparers.In,
      value: classIdList.join(',')
    });
  };

  
  const onGradeFilterChange = (options: IFilterOption[]) => {
    const gradeIdList = options.map((x) => x.id);
    setFilter({
      key: "Class.GradeId",
      comparison: comparers.In,
      value: gradeIdList.join(',')
    });
  };

  const onRequestCreate = async (data: Student.CreateUpdateStudentDto) => {
    try {
      await StudentsService.createStudent(data);
      toast('Thêm học sinh thành công', {
        type: toast.TYPE.SUCCESS
      });
      resetFilter();
    } catch (err) {
      toast.error("Không thành công, đã có lỗi xảy ra");
    }
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
      await DataImportService.importStudentsData(file);
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
          <Sidebar activeKey={routes.StudentsManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              searchBarPlaceholder="Tìm kiếm học sinh..."
              onTextChange={(value) => setFilter({key: 'Name', comparison: comparers.Contains, value: value })} 
              pageName="Quản lý học sinh"
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
                  filterCount={getFilterCount()}
                  filterComponent={(
                    <Fragment>
                      <FilterButton
                        title="Lớp"
                        options={classOptions}
                        onSelectedOptionsChange={onClassFilterChange}
                      />
                      <FilterButton
                        title="Khối"
                        options={gradeOptions}
                        onSelectedOptionsChange={onGradeFilterChange}
                      />
                    </Fragment>
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

export default StudentsPage;