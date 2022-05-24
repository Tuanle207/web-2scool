import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridApi, GridColDef, GridPageChangeParams, GridRowId, GridValueFormatterParams } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import PageTitleBar from '../components/PageTitleBar';
import { Class, Grade, Teacher } from '../interfaces';
import { ClassesService, GradesService, DataImportService, CoursesService, TeachersService } from '../api';
import { useDialog, useFetchV2 } from '../hooks';
import CreateOrUpdateClassRequest, { CreateOrUpdateClassRequestProps } from '../components/Modal/CreateOrUpdateClassRequest';
import { comparers, dataGridLocale } from '../appConsts';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import { busyService } from '../services';
import useStyles from '../assets/jss/views/ClassesPage';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật thông tin lớp học',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateClassRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    const classId = id.toString();
    const className = api.getCellValue(id, 'name')?.toString().toUpperCase();
    const deleteResult = await showDialog(null, {
      type: 'default',
      title: 'Xác nhận',
      message: `Bạn có chắc muốn xóa lớp ${className}?`,
      acceptText: 'Xác nhận'
    });
    const { result } = deleteResult;
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true);
      await ClassesService.removeClass({id: classId});
      toast.success(`Xóa lớp học ${className} thành công`)
      reloadCurrentPageData();
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể xóa lớp học');
    } finally {
      busyService.busy(false);
    }
    
  };

  const onRequestUpdate = async () => {
    const input = await initUpdateData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input);
    if  (result !== 'Ok' || !data) {
      return;
    }
    await saveUpdateData(data);
  };

  const initUpdateData = async (): Promise<CreateOrUpdateClassRequestProps | null> => {
    try {
      busyService.busy(true);
      const { items: courses } = await CoursesService.getAllCourses({});
      const { items: grades } = await GradesService.getAllGrades({});
      const { items: teachers } = await TeachersService.getAllTeachersSimpleList();
      const classId = id.toString();
      const editItem = await ClassesService.getClassById(classId);
      busyService.busy(false);
      const data: CreateOrUpdateClassRequestProps = {
        courses,
        grades,
        teachers,
        editItem
      };
      return data;
    } catch (err) {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo cập nhật');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  const saveUpdateData = async (data: Class.CreateUpdateClassDto): Promise<void> => {
    try {
      busyService.busy(true);
      const classId = id.toString();
      await ClassesService.updateClass({id: classId, data});
      toast.success('Cập nhật thông tin lớp học thành công');
      reloadCurrentPageData();
    } catch (err: any) {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật lớp học');
    } finally {
      busyService.busy(false);
    }
  }

  return (
    <div>
      <Tooltip title='Cập nhật thông tin lớp học này'>
        <IconButton onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa lớp học này'>
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

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Thêm lớp học mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateClassRequest
  });

  const [ gradeOptions, setGradeOptions ] = useState<IFilterOption[]>([]);

  const { 
    pagingInfo,
    setFilter,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter,
    getFilterCount
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

  const onRequestCreate = async () => {
    const input = await initCreationData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input);
    if  (result !== 'Ok' && !data) {
      return;
    }
    try {
      busyService.busy(true);
      await ClassesService.createClass(data);
      toast('Thêm lớp học thành công', {
        type: toast.TYPE.SUCCESS
      });
      resetFilter();
    } catch (err: any) {
      toast.error('Đã có lỗi xảy ra. Không thể tạo khóa học.')
    } finally {
      busyService.busy(false);
    }
  };

  const initCreationData = async (): Promise<CreateOrUpdateClassRequestProps | null> => {
    try {
      busyService.busy(true);
      const { items: courses } = await CoursesService.getAllCourses({});
      const { items: grades } = await GradesService.getAllGrades({});
      const { items: teachers } = await TeachersService.getAllTeachersSimpleList();
      busyService.busy(false);
      const data: CreateOrUpdateClassRequestProps = {
        courses,
        grades,
        teachers,
      };
      return data;
    } catch (err) {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

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
      await DataImportService.importClassesData(file);
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
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
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
              onMainButtonClick={onRequestCreate}
              filterCount={getFilterCount()}
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
  );
};

export default ClassesPage;