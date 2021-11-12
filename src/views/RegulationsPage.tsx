import { useEffect, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { Container, Grid, IconButton, Paper, Tooltip } from '@material-ui/core';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import PageTitleBar from '../components/PageTitleBar';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams,
  GridApi, GridRowId } from '@material-ui/data-grid';
import { Student, Regulation } from '../interfaces';
import { RegulationsService, StudentsService } from '../api';
import { useFetchV2 } from '../hooks/useFetchV2';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ActionModal from '../components/Modal';
import { comparers } from '../appConsts';
import { toast } from 'react-toastify';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/StudentsPage';
import regulationType from '../appConsts/regulationType';
import CreateOrUpdateRegulationModal from '../components/Modal/CreateOrUpdateRegulationModal';

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

  const onRequestDelete = async () => {
    await StudentsService.removeStudent({id: id.toString()});
    toast(`Xóa học sinh ${api.getCellValue(id, 'name')} thành công`, {
      type: toast.TYPE.SUCCESS
    });
    reloadCurrentPageData();
  };

  return (
    <div>
      <Tooltip title="Cập nhật thông tin quy định này">
          <IconButton  
            // onClick={() => ActionModal.show({
            //   title: "Cập nhật thông tin học sinh",
            //   acceptText: "Lưu",
            //   cancelText: "Hủy",
            //   component: <CreateOrUpdateStudentRequest id={id.toString()}/>,
            //   onAccept: onRequestUpdate
            // })} 
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      <Tooltip title="Xóa học sinh này">
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

const fetchAPIDebounced = AwesomeDebouncePromise(RegulationsService.getAllRegulations, 500);

const RegulationsPage = () => {

  const classes = useStyles();

  const [ criteriaOptions, setCriteriaOptions ] = useState<IFilterOption[]>([]);
  const [ regulationTypeOptions ] = useState<IFilterOption[]>([
    { id: regulationType.Student, label: "Học sinh", value: regulationType.Student },
    { id: regulationType.Class, label: "Lớp", value: regulationType.Class },
  ]);
  const [ creationModalShow, setCreationModalShow ] = useState(false);

  const { 
    pagingInfo,
    setFilter,
    getFilterCount,
    setPageIndex,
    setPageSize,
    data,
    loading,
    error,
    resetCache
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

  const onRequestCreate = async (data: Student.CreateUpdateStudentDto) => {
    await StudentsService.createStudent(data);
    toast('Thêm học sinh thành công', {
      type: toast.TYPE.SUCCESS
    });
    resetCache();
  };

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid container style={{ flex: 1 }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.RegulationManager} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
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
                  onMainButtonClick={() => setCreationModalShow(true)}
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
                />
              </Paper>
            </Grid>
            <CreateOrUpdateRegulationModal
              open={creationModalShow}
              onRequestClose={() => setCreationModalShow(false)}
              dataId="as"
              criteriaOptions={criteriaOptions}
              regulationTypeOptions={regulationTypeOptions}
            />
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
                />
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default RegulationsPage;