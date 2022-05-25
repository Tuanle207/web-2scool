import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams,
  GridApi, GridRowId } from '@material-ui/data-grid';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import { Student, Class } from '../interfaces';
import { ClassesService, IdentityService, StudentsService, GradesService, DataImportService } from '../api';
import { useFetchV2 } from '../hooks/useFetchV2';
import { formatDate } from '../utils/TimeHelper';
import { EMAIL_PATTERN } from '../utils/regex-pattern';
import { comparers, dataGridLocale } from '../appConsts';
import { toast } from 'react-toastify';
import CreateOrUpdateStudentRequest, { CreateOrUpdateStudentRequestProps } from '../components/Modal/CreateOrUpdateStudentRequest';
import CreateStudentAccountRequest, { CreateStudentAccountRequestProps } from '../components/Modal/CreateStudentAccountRequest';
import { useDialog } from '../hooks';
import { busyService } from '../services';
import useStyles from '../assets/jss/views/StudentsPage';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật thông tin học sinh',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateStudentRequest
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestUpdate = async () => {
    const input = await initUpdateData();
    if (!input) {
      return;
    }
    const editResult = await showDialog(input);
    const { result, data } = editResult;
    if (result !== 'Ok' || !data) {
      return;
    }
    await saveUpdateData(data);
  };

  const onRequestAccountCreate = async () => {
    const input = await initCreateAccountData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input, {
      type: 'data',
      title: 'Cấp tài khoản cho học sinh',
      acceptText: 'Cấp tài khoản',
      cancelText: 'Hủy',
      renderFormComponent: CreateStudentAccountRequest
    })
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await IdentityService.createUser(data);
      toast.success('Cấp tài khoản thành công');
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể cấp tài khoản cho học sinh.');
    } finally {
      busyService.busy(false);
    }
  };

  const initCreateAccountData = async (): Promise<CreateStudentAccountRequestProps | null> => {
    try {
      busyService.busy(true);
      const studentId = id.toString();
      const foundEmail = await IdentityService.doesStudentHaveAccountAlready(studentId);
      if (!!foundEmail && EMAIL_PATTERN.test(foundEmail))  {
        toast.info(`Học sinh này đã được cấp tài khoản với địa chỉ email "${foundEmail}" rồi`, {
          autoClose: 4000
        });
        return null;
      }
      const student = await StudentsService.getStudentById(studentId);
      const input: CreateStudentAccountRequestProps = {
        studentName: student.name,
        parentPhoneNumber: student.parentPhoneNumber,
        studentId: student.id,
      };
      return input;
    } catch (err) {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu để cấp tài khoản');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  const onRequestDelete = async () => {
    try {
      const studenId = id.toString();
      const studenName = api.getCellValue(id, 'name')?.toString().toUpperCase();
      const deleteResult = await showDialog(null, {
        type: 'default',
        title: 'Xác nhận',
        message: `Bạn có chắc muốn xóa học sinh ${studenName}?`,
        acceptText: 'Xác nhận'
      });
      const { result } = deleteResult;
      if (result === 'Ok') {
        busyService.busy(true);
        await StudentsService.removeStudent({ id: studenId });
        toast.success(`Xóa học sinh ${studenName} thành công`);
        reloadCurrentPageData();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể xóa giáo viên');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async (): Promise<CreateOrUpdateStudentRequestProps | null> => {
    try {
      busyService.busy(true);
      const studentId = id.toString();
      const student = await StudentsService.getStudentById(studentId);
      const { items: classes } = await ClassesService.getClassForSimpleList();
      return {
        editItem: student,
        classes
      };
    } catch (err) {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo cập nhật');
      return null;
    } finally {
      busyService.busy(false);
    }
  }

  const saveUpdateData = async (data: Student.CreateUpdateStudentDto) => {
    try {
      busyService.busy(true);
      const studentId = id.toString();
      await StudentsService.updateStudent({id: studentId, data});
      toast.success('Cập nhật thông tin học sinh thành công');
      reloadCurrentPageData();
    } catch (err: any) {
      toast.error('Đã có lỗi xảy ra. Không thể cập nhật lớp học');
    } finally {
      busyService.busy(false);
    }
  }

  return (
    <div>
      <Tooltip title='Cập nhật thông tin học sinh này'>
        <IconButton size="small" onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
        </Tooltip>
      <Tooltip title='Cấp tài khoản cho học sinh này'>
        <IconButton size="small" onClick={onRequestAccountCreate}>
          <PersonAddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa học sinh này'>
        <IconButton size="small" onClick={onRequestDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const cols: GridColDef[] =  [
  {
    field: 'name',
    headerName: 'Tên học sinh',
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
  {
    field: 'actions',
    headerName: 'Hành động',
    renderCell: RowMenuCell,
    sortable: false,
    width: 120,
    headerAlign: 'left',
    filterable: false,
    align: 'center',
    disableColumnMenu: true,
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(StudentsService.getAllStudents, 100);

const StudentsPage = () => {

  const classes = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Thêm học sinh mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateStudentRequest
  });

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

  const onRequestCreate = async () => {
    const input = await initUpdateData();
    if (!input) {
      return;
    }
    const editResult = await showDialog(input);
    const { result, data } = editResult;
    if (result !== 'Ok' || !data)  {
      return;
    } 
    try {
      busyService.busy(true);
      await StudentsService.createStudent(data);
      toast.success('Thêm học sinh thành công');
      resetFilter();
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể thêm học sinh');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async (): Promise<CreateOrUpdateStudentRequestProps | null> => {
    try {
      busyService.busy(true);
      const { items: classes } = await ClassesService.getClassForSimpleList();
      return { classes };
    } catch (err) {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo cập nhật');
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
      await DataImportService.importStudentsData(file);
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
              onMainButtonClick={onRequestCreate}
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
  );
};

export default StudentsPage;