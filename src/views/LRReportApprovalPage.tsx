/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Box, Badge, Paper, Container, Chip, Tooltip, IconButton, Menu, MenuItem,
  ListItemIcon, ListItemText } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Carousel, { Modal, ModalGateway, ViewType } from 'react-images'
import { DataGrid, GridColDef, GridApi, GridPageChangeParams, GridValueFormatterParams,
  GridCellParams } from '@material-ui/data-grid';
import DateFnsUtils from '@date-io/date-fns';
import React, { useEffect, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { LrReportsService } from '../api';
import { useFetchV2 } from '../hooks';
import { LrReport, User, Class } from '../interfaces';
import { formatDate, formatFullDateTime } from '../utils/TimeHelper';
import { comparers, dcpReportStatus, dcpReportStatusDic } from '../appConsts';
import { routes } from '../routers/routesDictionary';
import FilterButton, { IFilterOption } from '../components/FilterButton';
import { ReactComponent as FilterIcon } from '../assets/img/filter.svg';
import RestoreIcon from '@material-ui/icons/Restore';
import ErrorIcon from '@material-ui/icons/Error';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import PageviewIcon from '@material-ui/icons/Pageview';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { getFullUrl } from '../utils/ImageHelper';
import useStyles from '../assets/jss/views/DCPReportHistoryPage';


const DetailCell = (params: GridCellParams) => {
  const { api, id } = params;
  const [ openModal, setOpenModal ] = useState(false);

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const images = ((api as GridApi).getCellValue(id, 'attachedPhotos') as string[] || [])
    .map((src) => ({source: getFullUrl(src)} as ViewType));

  return (
    <Box>
      <IconButton size="small" color="primary" onClick={toggleModal}
      >
        <PageviewIcon />
      </IconButton>
      <ModalGateway>
        {openModal ? (
          <Modal onClose={toggleModal}>
            <Carousel views={images} />
          </Modal>
        ) : null}
      </ModalGateway>
    </Box>
    

  );
};

const MenuCell = (props: GridCellParams) => {

  const { api, id } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [ openModal, setOpenModal ] = useState(false);

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const reloadCurrentPageData = () => {
    api.setPage(api.getState().pagination.page);
  };

  const acceptDcpReport = async () => {
    try {
      handleClose();
      await LrReportsService.acceptLrReport([id.toString()]);
      reloadCurrentPageData();
    } catch {

    }
  };

  const rejectDcpReport = async () => {
    try {
      handleClose();
      await LrReportsService.rejectLrReport(id.toString());
      reloadCurrentPageData();
    } catch {

    }
  };
  
  const cancelAssessDcpReport = async () => {
    try {
      handleClose();
      await LrReportsService.cancelAssessLrReport(id.toString());
      reloadCurrentPageData();
    } catch {

    }
  };

  const viewDetail = () => {
    handleClose();
    toggleModal();
  };


  const status = api.getCellValue(id, 'status');
  const images = ((api as GridApi).getCellValue(id, 'attachedPhotos') as string[] || [])
    .map((src) => ({source: getFullUrl(src)} as ViewType));

  return (
    <div>
      <Paper>
        <Menu id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
          <MenuItem onClick={viewDetail}>
            <ListItemIcon style={{minWidth: 30}}>
              <PageviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Xem chi tiết" />
          </MenuItem>
          {
            status === dcpReportStatus.Created ? (
              <>
                <MenuItem onClick={acceptDcpReport}>
                  <ListItemIcon style={{minWidth: 30}}>
                    <DoneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Chấp nhận" />
                </MenuItem>
                <MenuItem onClick={rejectDcpReport}>
                  <ListItemIcon style={{minWidth: 30}}>
                    <WarningIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Từ chối" />
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={cancelAssessDcpReport}>
                <ListItemIcon style={{minWidth: 30}}>
                  <RestoreIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Hủy duyệt" />
              </MenuItem>
            )
          }
        </Menu>
      </Paper>
      <IconButton size="small"
          aria-controls={"simple-menu"}
          aria-haspopup="true"
          onClick={handleClick}
      >
        <MoreHorizIcon />
      </IconButton>
      <ModalGateway>
        {openModal ? (
          <Modal onClose={toggleModal}>
            <Carousel views={images} />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
};

const StatusCell = (params: GridCellParams) => {
  const classes = useStyles();

  const status = params.value;
  const statusText = dcpReportStatusDic[params.value as string];

  return (
    <Chip
      icon={status === dcpReportStatus.Created ? <ErrorIcon /> 
        : status === dcpReportStatus.Approved ? <DoneIcon /> : <WarningIcon />}
      label={statusText}
      variant="outlined"
      className={status === dcpReportStatus.Created ? classes.pendingStatus 
        : status === dcpReportStatus.Approved ? classes.approvedStatus : classes.rejectedStatus}
    />
  );
};

const cols: GridColDef[] =  [
  {
    field: 'id',
    headerName: 'Mã',
    hide: true
  },
  
  {
    field: 'creator',
    headerName: 'Người chấm',
    width: 200,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as User.UserForSimpleListDto;
      return value ? value.name : '';
    }
  },
  {
    field: 'class',
    headerName: 'Lớp',
    width: 100,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as Class.ClassForSimpleListDto;
      return value.name;
    }
  },
  {
    field: 'totalPoint',
    headerName: 'Điểm',
    width: 100
  },
  {
    field: 'absenceNo',
    headerName: 'Vắng',
    width: 100
  },
  {
    field: 'status',
    headerName: 'Trạng thái',
    headerAlign: 'center',
    width: 180,
    renderCell: StatusCell
  },
  {
    field: 'creationTime',
    headerName: 'Thời gian tạo',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const creationTime = (params.value as Date).toLocaleString();
      return formatFullDateTime(creationTime);
    }
  },
  {
    field: 'detail',
    headerName: 'Chi tiết',
    renderCell: DetailCell,
    sortable: false,
    headerAlign: 'center',
    width: 80,
    filterable: false,
    align: 'center',
    disableColumnMenu: true,
  },
  {
    field: 'Menu',
    headerName: '',
    renderCell: MenuCell,
    sortable: false,
    headerAlign: 'center',
    headerClassName: 'hiddenDataGridHeader',
    width: 80,
    filterable: false,
    align: 'center',
    disableColumnMenu: true,
  },
];

const fetchAPIDebounced = AwesomeDebouncePromise(LrReportsService.getLrReportsForApproval, 500);

const LRReportApprovalPage = () => {
  
  const classes = useStyles();

  const [ statusOptions ] = useState<IFilterOption[]>([
    { id: dcpReportStatus.Created, label: dcpReportStatusDic[dcpReportStatus.Created], value: dcpReportStatus.Created, },
    { id: dcpReportStatus.Approved, label: dcpReportStatusDic[dcpReportStatus.Approved], value: dcpReportStatus.Approved, },
    { id: dcpReportStatus.Rejected, label: dcpReportStatusDic[dcpReportStatus.Rejected], value: dcpReportStatus.Rejected, },
  ]);

  const [ items, setItems ] = useState<LrReport.LRReportDto[]>([]);
  const [ dateFilter, setDateFilter ] = useState<Date | null>(new Date());
  const [ dateFilterType, setDateFilterType ] = useState<string>('today');

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
  } = useFetchV2({ 
    fetchFn: fetchAPIDebounced, 
    filter: [
    {
      key: 'Status',
      comparison: comparers.In,
      value: statusOptions[0].value?.toString() ?? ''
    },
    {
      key: 'CreationTime',
      comparison: comparers.Gte,
      value: formatDate(new Date(2020, 1, 1).toLocaleString(), 'MM/DD/YYYY')
    },
    {
      key: 'CreationTime',
      comparison: comparers.Lte,
      value: formatDate(new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString(), 'MM/DD/YYYY')
    }
  ] });
 
  useEffect(() => {
    document.title = '2Cool | Duyệt sổ đầu bài';
  }, []);

  useEffect(() => {
    const firstItem = data.items.length > 0 ? data.items[0] : null;
    if (firstItem && items.findIndex(x => x.id === firstItem.id) === -1) {
      setItems(prev => [...prev, ...data.items]);
    }
  }, [data]);

  const handleOnDateChange = (date: Date | null) => {
    setDateFilter(date);
    if (date !== null) {
      const start = new Date(date);
      const end = start.getDate() + 1;
      const startDate = new Date(start);
      const endDate = new Date(start.setDate(end));
      setFilter({
        key: 'CreationTime',
        comparison: comparers.Gte,
        value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
      });
      setFilter({
        key: 'CreationTime',
        comparison: comparers.Lte,
        value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
      });
      setItems([]);
      setPageIndex(0);
      resetCache();
    }
  };

  const handleWeekFilterClick = () => {
    setDateFilterType('week');
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); 
    let start = now.getDate() - dayOfWeek + 1;
    const end = start + 6;
    const startDate = new Date(now.setDate(start));
    const endDate = new Date(now.setDate(end));

    setFilter({
      key: 'CreationTime',
      comparison: comparers.Gte,
      value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setFilter({
      key: 'CreationTime',
      comparison: comparers.Lte,
      value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setItems([]);
    setPageIndex(0);
    resetCache();
  };


  const handleTodayFilterClick = () => {
    setDateFilterType('today');
    const now = new Date();
    const end = now.getDate() + 1;
    const startDate = new Date(now);
    const endDate = new Date(now.setDate(end));

    setFilter({
      key: 'CreationTime',
      comparison: comparers.Gte,
      value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setFilter({
      key: 'CreationTime',
      comparison: comparers.Lte,
      value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setItems([]);
    setPageIndex(0);
    resetCache();
  };

  const onStatusFilterChange = (options: IFilterOption[]) => {
    const listStatus = options.map((x) => x.id);
    setFilter({
      key: 'Status',
      comparison: comparers.In,
      value: listStatus.join(',')
    });
  };

  const onPageChange = (param: GridPageChangeParams) => {
    setPageIndex(param.page + 1);
  };

  const onPageSizeChange = (param: GridPageChangeParams) => {
    setPageSize(param.pageSize);
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container style={{ height: '100%' }}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.LRReportApproval} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              pageName="Duyệt sổ đầu bài"
            />
          </Grid>
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
            <Grid item container
              style={{
                paddingTop: 16, 
                paddingRight: 24, 
                paddingLeft: 24,
                background: "#e8e8e8"
              }}
            >
              <Paper variant="outlined" elevation={1} style={{ width: "100%" }}>
                <Grid item container direction='row' alignItems='center' style={{ padding: "5px 32px", height: 54 }}>
                  <Tooltip title="Bộ lọc" style={{ marginRight: 16 }}>
                      <Badge badgeContent={getFilterCount()} color="primary" >
                        <FilterIcon fontSize="small" />
                      </Badge>
                  </Tooltip>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Box>
                      <KeyboardDatePicker
                        disableToolbar
                        size="small"
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="dense"
                        id="get-discipline-report-filter"
                        value={dateFilter}
                        onChange={handleOnDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        style={{ width: 140 }}
                      />
                    </Box>
                  </MuiPickersUtilsProvider>
                  <Chip 
                      clickable label='Hôm nay' 
                      onClick={handleTodayFilterClick}
                      variant={dateFilterType === 'today' ? 'default' : 'outlined'} 
                      color={dateFilterType === 'today' ? 'primary' : 'default'} style={{marginLeft: 16}}
                      />
                  <Chip clickable label='Tuần này' 
                    onClick={handleWeekFilterClick}
                    variant={dateFilterType === 'week' ? 'default' : 'outlined'} 
                    color={dateFilterType === 'week' ? 'primary' : 'default'}
                    style={{marginLeft: 8, marginRight: 16}}
                  />
                  <FilterButton
                    title="Trạng thái"
                    options={statusOptions}
                    defaultSelectedOptions={[statusOptions[0]]}
                    onSelectedOptionsChange={onStatusFilterChange}
                  />
                </Grid>
              </Paper>
            </Grid>              
            <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8'}}>
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

export default LRReportApprovalPage;