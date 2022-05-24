import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import Header from '../components/Header';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams,
  GridApi, GridRowId } from '@material-ui/data-grid';
import { Regulation } from '../interfaces';
import { DataImportService, RegulationsService } from '../api';
import { useFetchV2 } from '../hooks/useFetchV2';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import ActionModal from '../components/Modal';
import { comparers, regulationType, dataGridLocale } from '../appConsts';
import { toast } from 'react-toastify';
import { useDialog } from '../hooks';
import CreateOrUpdateRegulationRequest, { CreateOrUpdateRegulationRequestProps } from '../components/Modal/CreateOrUpdateRegulationRequest';
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
    title: 'Cập nhật thông tin quy định',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateRegulationRequest,
  });

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const onRequestDelete = async () => {
    try {
      const regulationId = id.toString();
      const regulationName = api.getCellValue(regulationId, 'displayName')?.toString().toUpperCase();
      const deleteResult = await showDialog(null, {
        type: 'default',
        title: 'Xác nhận',
        message: `Bạn có chắc muốn xóa quy định ${regulationName}?`,
        acceptText: 'Xác nhận'
      });
      const { result } = deleteResult;
      if (result === 'Ok') {
        busyService.busy(true);
        await RegulationsService.removeRegulation(regulationId);
        toast.success(`Xóa quy định ${regulationName} thành công`);
        reloadCurrentPageData();
      }
    } catch (err) {
      toast.error('Đã có lỗi xảy ra, không thể xóa quy định');
    } finally {
      busyService.busy(false);
    }
  };

  const onRequestUpdate = async () => {
    const regulationId = id.toString();
    const input = await initUpdateData(regulationId);
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input);
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await RegulationsService.updateRegulation(regulationId, data);
      toast.success('Cập nhật quy định thành công');
      reloadCurrentPageData();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể lưu quy định');
    } finally {
      busyService.busy(false);
    }
  };

  const initUpdateData = async (editId: string) =>  {
    try {
      busyService.busy(true);
      
      const { items } = await RegulationsService.getCriteriaForSimpleList();
      const regulationTypeOptions: IFilterOption[] = [
        { id: regulationType.Student, label: "Học sinh", value: regulationType.Student },
        { id: regulationType.Class, label: "Lớp", value: regulationType.Class },
      ];
      const result: CreateOrUpdateRegulationRequestProps = {
        criterias: items,
        regulationTypes: regulationTypeOptions,
      };
      result.editItem = await RegulationsService.getRegulationById(editId);
      return result;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu.');
      return null;
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <div>
      <Tooltip title='Cập nhật quy định này'>
        <IconButton onClick={onRequestUpdate}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title='Xóa quy định này'>
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
    width: 120
  },
  {
    field: 'displayName',
    headerName: 'Tên',
    width: 300
  },
 
  {
    field: 'criteria',
    headerName: 'Tiêu chí',
    width: 220,
    valueFormatter: (params: GridValueFormatterParams) => (params.value as Regulation.CriteriaDto).displayName
  },
  {
    field: 'type',
    headerName: 'Loại quy định',
    width: 130,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as string;
      switch (value) {
        case regulationType.Student:
          return "Học sinh";
        case regulationType.Class:
          return "Lớp";
        default:
          return "Không XĐ";
      }
    }
  },
  {
    field: 'point',
    headerName: 'Điểm trừ',
    width: 120
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(RegulationsService.getAllRegulations, 100);

const RegulationsPage = () => {

  const classes = useStyles();
  const fileRef = useRef<HTMLInputElement>(null);

  const [ criteriaOptions, setCriteriaOptions ] = useState<IFilterOption[]>([]);
  const [ regulationTypeOptions ] = useState<IFilterOption[]>([
    { id: regulationType.Student, label: "Học sinh", value: regulationType.Student },
    { id: regulationType.Class, label: "Lớp", value: regulationType.Class },
  ]);

  const { showDialog } = useDialog({
    type: 'data',
    title: 'Thêm quy định nề nếp mới',
    acceptText: 'Lưu',
    cancelText: 'Hủy',
    renderFormComponent: CreateOrUpdateRegulationRequest
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

    const initFilterData = async () => {
      const { items } = await RegulationsService.getCriteriaForSimpleList();
      const options: IFilterOption[] = items.map((el) => ({
        id: el.id,
        label: el.name,
        value: el.id
      }));
      setCriteriaOptions(options);
    };

    initFilterData();

    document.title = '2Scool | Quản lý quy định nề nếp';
  }, []);

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  const onCriteriaFilterChange = (options: IFilterOption[]) => {
    const criteriaIdList = options.map((x) => x.id);
    setFilter({
      key: "CriteriaId",
      comparison: comparers.In,
      value: criteriaIdList.join(',')
    });
  };

  const onRegulationTypeFilterChange = (options: IFilterOption[]) => {
    const regulationTypeList = options.map((x) => x.id);
    setFilter({
      key: "Type",
      comparison: comparers.In,
      value: regulationTypeList.join(',')
    });
  };

  const onCreateRequest = async () => {
    const input = await initCreationData();
    if (!input) {
      return;
    }
    const { result, data } = await showDialog(input);
    if (result !== 'Ok' || !data) {
      return;
    }
    try {
      busyService.busy(true);
      await RegulationsService.createRegulation(data);
      toast.success('Thêm quy định thành công');
      resetFilter();
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể lưu quy định');
    } finally {
      busyService.busy(false);
    }
  };

  const initCreationData = async (editId?: string) =>  {
    try {
      busyService.busy(true);
      
      const { items } = await RegulationsService.getCriteriaForSimpleList();
      const result: CreateOrUpdateRegulationRequestProps = {
        criterias: items,
        regulationTypes: regulationTypeOptions,
      };
      if (editId) {
        const editItem = await RegulationsService.getRegulationById(editId);
        result.editItem = editItem;
      }
      
      return result;
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể khởi tạo dữ liệu.');
      return null;
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
      await DataImportService.importRegulationsData(file);
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
          searchBarPlaceholder="Tìm kiếm quy định..."
          onTextChange={(value) => setFilter({key: 'DisplayName', comparison: comparers.Contains, value: value })}
          pageName="Quản lý quy định nề nếp" 
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
              title={`Quy định nề nếp`} 
              onMainButtonClick={onCreateRequest}
              filterCount={getFilterCount()}
              filterComponent={(
                <>
                  <FilterButton
                    title="Tiêu chí"
                    options={criteriaOptions}
                    onSelectedOptionsChange={onCriteriaFilterChange}
                  />
                  <FilterButton
                    title="Loại quy định"
                    options={regulationTypeOptions}
                    onSelectedOptionsChange={onRegulationTypeFilterChange}
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

export default RegulationsPage;