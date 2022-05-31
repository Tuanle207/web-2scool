import { ChangeEvent, Fragment, useEffect, useRef } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import Header from '../components/Header';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams,
  GridApi, GridRowId } from '@material-ui/data-grid';
import { DataImportService, RegulationsService } from '../api';
import { useFetchV2 } from '../hooks/useFetchV2';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import ActionModal from '../components/Modal';
import { comparers, dataGridLocale } from '../appConsts';
import { toast } from 'react-toastify';
import { useDialog } from '../hooks';
import { busyService } from '../services';
import useStyles from '../assets/jss/views/StudentsPage';
import CreateOrUpdateCriteriaRequest from '../components/Modal/CreateOrUpdateCriteriaRequest';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const RowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Cập nhật thông tin tiêu chí',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateCriteriaRequest,
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    try {
      const criteriaId = id.toString();
      const criteriaName = api.getCellValue(criteriaId, 'displayName')?.toString().toUpperCase();
      const deleteResult = await showDialog(null, {
        type: 'default',
        title: 'Xác nhận',
        message: `Bạn có chắc muốn xóa tiêu chí ${criteriaName}?`,
        acceptText: 'Xác nhận'
      });
      const { result } = deleteResult;
      if (result === 'Ok') {
        busyService.busy(true);
        await RegulationsService.removeCriteria(criteriaId);
        toast.success(`Xóa tiêu chí ${criteriaName} thành công`);
        reloadCurrentPageData();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể xóa tiêu chí');
    } finally {
      busyService.busy(false);
    }
  };

  const onRequestUpdate = async () => {
    const criteriaId = id.toString();
    const input = await initUpdateData(criteriaId);
    if (!input) {
      return;
    }
    const { result, data } = await showDialog({editItem: input});
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await RegulationsService.updateCriteria(criteriaId, data);
      toast.success('Cập nhật tiêu chí thành công');
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể lưu tiêu chí');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async (editId: string) =>  {
    try {
      busyService.busy(true);
      const editItem = await RegulationsService.getCriteriaById(editId);
      return editItem;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu.');
      return null;
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <div>
      <Tooltip title='Cập nhật tiêu chí này'>
        <IconButton size="small" onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa tiêu chí này'>
        <IconButton size="small" onClick={onRequestDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const cols: GridColDef[] =  [
  {
    field: 'displayName',
    headerName: 'Tên tiêu chí',
    width: 400,
    flex: 1,
  },
  {
    field: 'description',
    headerName: 'Mô tả',
    width: 600,
  },
  {
    field: 'actions',
    headerName: 'Hành động',
    renderCell: RowMenuCell,
    sortable: false,
    width: 120,
    headerAlign: 'left',
    filterable: false,
    disableColumnMenu: true,
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(RegulationsService.getAllCriterias, 100);

const CriteriasPage = () => {

  const classes = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Thêm tiêu chí nề nếp mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateCriteriaRequest
  });

  const { 
    pagingInfo,
    setFilter,
    getFilterCount,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetFilter,
  } = useFetchV2({ fetchFn: fetchAPIDebounced });

  useEffect(() => {
    document.title = '2Scool | Quản lý tiêu chí nề nếp';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onCreateRequest = async () => {
    const { result, data } = await showDialog();
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await RegulationsService.createCriteria(data);
      toast.success('Thêm tiêu chí thành công');
      resetFilter();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể lưu tiêu chí');
    } finally {
      busyService.busy(false);
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
      await DataImportService.importCriteriasData(file);
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
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction='column'>
      <Grid item >
        <Header
          searchBarPlaceholder="Tìm kiếm tiêu chí..."
          onTextChange={(value) => setFilter({key: 'DisplayName', comparison: comparers.Contains, value: value })}
          pageName="Quản lý tiêu chí nề nếp" 
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
              title={`tiêu chí nề nếp`} 
              onMainButtonClick={onCreateRequest}
              filterCount={getFilterCount()}
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

export default CriteriasPage;