/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Box, Button, Paper, Container, Chip, Tooltip, IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { DataGrid, GridColDef, GridPageChangeParams, GridValueFormatterParams,
  GridApi, GridRowId, GridCellParams } from '@material-ui/data-grid';
import DateFnsUtils from '@date-io/date-fns';
import React, { useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DisciplineApprovalCard from '../components/DCPReport/DisciplineApprovalCard';
import { DcpReportsService } from '../api';
import { useFetch, useFetchV2, usePagingInfo } from '../hooks';
import { DcpReport, User } from '../interfaces';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatDate, formatTime, getDayOfWeek } from '../utils/TimeHelper';
import { comparers, dcpReportStatus, dcpReportStatusDic } from '../appConsts';
import { routes } from '../routers/routesDictionary';
import { ReactComponent as FilterIcon } from '../assets/img/filter.svg';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import DoneIcon from '@material-ui/icons/Done';
import WarningIcon from '@material-ui/icons/Warning';
import PageviewIcon from '@material-ui/icons/Pageview';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useStyles from '../assets/jss/views/DCPReportHistoryPage';
import FilterButton, { IFilterOption } from '../components/FilterButton';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}


const DetailCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const reloadCurrentPageData = () => {
  };

  return (
    <IconButton size="small" color="primary"
    >
      <PageviewIcon />
    </IconButton>

  );
};

const MenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const reloadCurrentPageData = () => {
  };

  return (
    <IconButton size="small" 
    >
      <MoreHorizIcon />
    </IconButton>
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
      size="small"
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
    field: 'dcpClassReports',
    headerName: 'Lớp được chấm',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as DcpReport.DcpClassReportDto[];
      return value ? value.map(x => x.class.name).join(', ') : '';
    }
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
      return `${getDayOfWeek(creationTime)} ${formatTime(creationTime, 'HH:mm')}, ${formatDate(creationTime)}`;
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

const fetchAPIDebounced = AwesomeDebouncePromise(DcpReportsService.getDcpReportsForApproval, 500);

const DCPReportsApprovalPage = () => {
  
  const classes = useStyles();

  React.useEffect(() => {
    document.title = '2Cool | Lịch sử duyệt chấm điểm nề nếp';
  }, []);

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
      comparison: '',
      value: dcpReportStatus.Created
    },
    {
      key: 'Status',
      comparison: '',
      value: dcpReportStatus.Approved
    },
    {
      key: 'Status',
      comparison: '',
      value: dcpReportStatus.Rejected
    },
    {
      key: 'StartDate',
      comparison: comparers.Eq,
      value: formatDate(new Date(2020, 1, 1).toLocaleString(), 'MM/DD/YYYY')
    },
    {
      key: 'EndDate',
      comparison: comparers.Eq,
      value: formatDate(new Date(new Date().setDate(new Date().getDate() + 1)).toLocaleString(), 'MM/DD/YYYY')
    }
  ] });

  const [ items, setItems ] = useState<DcpReport.DcpReportDto[]>([]);
  const [ dateFilter, setDateFilter ] = useState<Date | null>(new Date());
  const [ dateFilterType, setDateFilterType ] = useState<string>('today');
  const [ statusOptions ] = useState<IFilterOption[]>([
    { id: dcpReportStatus.Created, label: dcpReportStatusDic[dcpReportStatus.Created], value: dcpReportStatus.Created, },
    { id: dcpReportStatus.Approved, label: dcpReportStatusDic[dcpReportStatus.Approved], value: dcpReportStatus.Approved, },
    { id: dcpReportStatus.Rejected, label: dcpReportStatusDic[dcpReportStatus.Rejected], value: dcpReportStatus.Rejected, },
  ]);

  React.useEffect(() => {
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
        key: 'StartDate',
        comparison: comparers.Eq,
        value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
      });
      setFilter({
        key: 'EndDate',
        comparison: comparers.Eq,
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
      key: 'StartDate',
      comparison: comparers.Eq,
      value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setFilter({
      key: 'EndDate',
      comparison: comparers.Eq,
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
      key: 'StartDate',
      comparison: comparers.Eq,
      value: formatDate(startDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setFilter({
      key: 'EndDate',
      comparison: comparers.Eq,
      value: formatDate(endDate.toLocaleString(), 'MM/DD/YYYY')
    });
    setItems([]);
    setPageIndex(0);
    resetCache();
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
          <Sidebar activeKey={routes.DCPReportHistory} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1 }} item container xs={8} sm={9} md={10} direction='column'>
          <Grid item >
            <Header
              pageName="Lịch sử duyệt chấm điểm nề nếp"
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
              <Paper variant="outlined" elevation={1}  style={{ width: "100%" }}>
                <Grid item container direction='row' alignItems='center' style={{ padding: "5px 32px" }}>
                  <Tooltip title="Bộ lọc" style={{ marginRight: 16 }}>
                    <FilterIcon fontSize="small" />
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

export default DCPReportsApprovalPage;