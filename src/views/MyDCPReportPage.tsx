/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Box, Button, makeStyles, List, ListItem, Typography, Tabs, Tab, IconButton, Menu, MenuItem, Chip, Tooltip } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { DcpReport, Regulation } from '../common/interfaces';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { DcpReportsService } from '../common/api';
import { usePagingInfo, useFetch } from '../hooks';
import { formatDate, getDayOfWeek, formatTime } from '../common/utils/TimeHelper';
import SettingsIcon from '@material-ui/icons/Settings';
import ActionModal from '../components/Modal';
import { toast } from 'react-toastify';
import { comparers } from '../common/appConsts';
import { FindInPage } from '@material-ui/icons';
import StudentList from '../components/Modal/StudentList';


const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    }
  },
  actionGroup: {
    padding: theme.spacing(1, 4),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  list: {
    // overflowY: 'scroll'
    // padding: '20px 100px' 
  },
  datagridContainer: {
    // height: '100%', 
    width: '100%',
    '& .MuiDataGrid-columnSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-colCellTitle': {
      fontWeight: 700,
    },
    '& .MuiDataGrid-root': {
      border: 'none',
      '& .MuiDataGrid-withBorder': {
        borderRight: 'none',
      }
    },
  },
  dcpReportClassFilter: {
    minHeight: 0,
    // padding: theme.spacing(2), 
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    minWidth: 0,
    overflow: 'hidden',
    '&::-webkit-scrollbar': {
      display: 'none',
    }
  },
  classFilter: {
    margin: theme.spacing(1, 1, 1, 0),
  },

  dateCardContainer: {
    padding: theme.spacing(1, 2), 
    border: '1px solid #000',
    boxShadow: '2px 2px 6px #000',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white
    }
  },
  dateCardContainerActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  classTabContainer: {

    '& .MuiTabs-scroller.MuiTabs-scrollable': {
      maxWidth: 750
    }
  },
  emptyText: {
    color: theme.palette.grey[500],
    textAlign: 'center'
  }
}));


const cols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Mã',
    hide: true
  },
  {
    field: 'regulation',
    headerName: 'Vi phạm',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams) => ((params.value) as Regulation.RegulationForSimpleListDto).name
  },
  {
    field: 'relatedStudents',
    headerName: 'Học sinh vi phạm',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams) => {
      const students = (params.value) as DcpReport.DcpStudentReportDto[];
      if (!students || students.length === 0) {
        return 'Trống';
      }
      return students.map(el => el.student.name).join(', ');
    }
  },
  {
    field: '',
    disableClickEventBubbling: true,
    renderCell: (params) => {
      // const onClick = () => {
      //   const id = params.getValue('id');
      // };

      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary'
          // onClick={onClick}
          // onClick={() => ActionModal.show({
          //   component: <StudentList students={[]} />,
          //   title: 'Danh sách học sinh vi phạm'
          // })}
          >
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

const DateCard = ({
  date, 
  id, 
  onClick=(() => {}), 
  resetCache, 
  active = false 
}: {
    date: Date | string;
    id: string;
    resetCache: Function;
    onClick: () => void;
    active?: boolean;
  }) => {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const deleteReport = async () => {
    try {
      await DcpReportsService.deleteDcpReportById(id);
      toast('Xóa phiếu chấm điểm thành công', {
        type: 'success'
      });
      resetCache();
    } catch (err) {
      console.log({err});
      toast('Xóa thất bại! Đã có lỗi xảy ra.', {
        type: 'error'
      });
    }
    
  }

  const handleUpdate = () => {
    setAnchorEl(null);
    history.push(`dcp-report-update/${id}`)
  };

  const handleDelete = () =>  {
    ActionModal.show({
      title: `Xác nhận xóa phiếu chấm điểm lúc ${formatTime(date.toLocaleString())} ?`,
      onAccept: deleteReport
    })
    setAnchorEl(null);
  }
  

  return (
    <Grid key={id} container alignItems={'center'} 
      className={`${classes.dateCardContainer} ${active ? classes.dateCardContainerActive : ''}`}
      onClick={onClick}
    >
      <Typography variant={'body2'}>{`${getDayOfWeek(date.toLocaleString())} - ${formatTime(date.toLocaleString())}`}</Typography>
      <IconButton size='small'
        style={{ marginLeft: 'auto' }}
        aria-controls={`dcp-report-menu-${id}`} 
        aria-haspopup='true'
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <SettingsIcon />
      </IconButton> 
      <Menu
        id={`dcp-report-menu-${id}`}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onBackdropClick={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleUpdate}>Cập nhật</MenuItem>
        <MenuItem onClick={handleDelete}>Xóa</MenuItem>
      </Menu>
    </Grid>
  );
};

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  activeIndex: number;
  data: DcpReport.DcpClassReportItemDto[]
}

function TabPanel(props: TabPanelProps) {
  const { children, index, activeIndex, data, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role='tabpanel'
      hidden={index !== activeIndex}
      aria-labelledby={`scrollable-auto-tab-${activeIndex}`}
      id={`scrollable-auto-tabpanel-${activeIndex}`}
      {...other}

      >
        {index === activeIndex && (
          <Container className={classes.datagridContainer}>
            <DataGrid
              columns={cols}
              rows={data}
              autoHeight
              disableExtendRowFullWidth
              hideFooterPagination
              disableColumnFilter
              disableColumnMenu
              hideFooterSelectedRowCount
              onCellClick={(params) => {
                if (params.colIndex === 2) {
                  const id = params.getValue('id');
                  const rowData = data.find(x => x.id === id);
                  const students = rowData ? rowData.relatedStudents : []
                  ActionModal.show({
                    title: 'Danh sách học sinh vi phạm',
                    component: <StudentList students={students} />
                  });
                }
              }}
            />
          </Container>
        )}
      </div>
  );
}

const MyDCPReportPage = () => {

  const classes = useStyles();
  const history = useHistory();

  const {pagingInfo, setPageIndex, setFilter} = usePagingInfo();
  const {loading, data, error, resetCache} = useFetch<DcpReport.DcpReportDto>(
    DcpReportsService.getMyDcpReports, 
    { ...pagingInfo, pageIndex: pagingInfo.pageIndex! + 1 }
  );
  const [selectedReport, setSelectedReport] = React.useState<DcpReport.DcpReportDto | null>(null);
  const [classTabIndex, setClassTabIndex] = React.useState(0); 
  const [dateFilter, setDateFilter] = React.useState<Date | null>(new Date());
  const [dateFilterType, setDateFilterType] = React.useState<string>('today');

  React.useEffect(() => {
    
    document.title = '2Cool | Lịch sử chấm phiếu chấm điểm của tôi';
    
    if (dateFilter) {
      setFilter({
        key: 'StartDate',
        comparison: comparers.Eq,
        value: formatDate(dateFilter.toLocaleString(), 'MM/DD/YYYY')
      });
      setFilter({
        key: 'EndDate',
        comparison: comparers.Eq,
        value: formatDate(dateFilter.toLocaleString(), 'MM/DD/YYYY')
      });
    }
    
  }, []);

  React.useEffect(() => {
    if (selectedReport === null && data.items.length > 0) {
      setSelectedReport(data.items[0]);
    }
    if (data.items.length === 0) {
      setSelectedReport(null);
    }
  }, [data]);

  React.useEffect(() => {
    if (selectedReport && selectedReport.dcpClassReports.length > 0) {
      setClassTabIndex(0);
    }
  }, [selectedReport]);

  const handleTabIndexChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setClassTabIndex(newValue);
  };

  const handleOnDateChange = (date: Date | null) => {
    setDateFilter(date);
    if (date !== null) {
      setFilter({
        key: 'StartDate',
        comparison: comparers.Eq,
        value: formatDate(date.toLocaleString(), 'MM/DD/YYYY')
      });
      setFilter({
        key: 'EndDate',
        comparison: comparers.Eq,
        value: formatDate(date.toLocaleString(), 'MM/DD/YYYY')
      });

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
    resetCache();
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'my-dcp-report'} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box>
                    <KeyboardDatePicker
                      disableToolbar
                      fullWidth
                      variant='dialog'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-discipline-report-filter'
                      label='Chọn ngày chấm'
                      value={dateFilter}
                      onChange={handleOnDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'my dcp report - change date',
                      }}
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
                  style={{marginLeft: 8}}
                />
              </Grid>

              <Grid item container alignItems='flex-end' justify='flex-end'>
                <Button 
                  variant={'contained'} 
                  color={'primary'}
                  onClick={() => history.push('dcp-report-creation')}>
                  Tạo phiếu chấm nề nếp
                </Button>
              </Grid>
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              {
                loading && (
                  <Grid container justify='center' alignItems='center'>
                    <p className={classes.emptyText}>Đang tải ...</p>
                  </Grid>
                )
              }
              {
                !loading && data.items.length === 0 && (
                  <Grid container justify='center' alignItems='center'>
                    <p className={classes.emptyText}>Chưa có phiếu chấm nào!</p>
                  </Grid>

                )
              }
              {
                !loading && data.items.length > 0 && (
                  <Grid item style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                    <List className={classes.list}>
                      {
                        data.items.map((el, i) => (
                        <ListItem key={el.id}>
                          <DateCard 
                            id={el.id}
                            resetCache={resetCache}
                            date={el.creationTime} 
                            active={selectedReport?.id === el.id}
                            onClick={() => setSelectedReport(el)}
                          />
                        </ListItem>))
                      }
                    </List>
                  </Grid>
                )
              }
              {
                !loading && data.items.length > 0 && (
                  <Grid item container direction={'column'} alignItems={'stretch'} style={{ flex: 3 }}>
                    <Grid item container className={classes.dcpReportClassFilter} style={{flexWrap: 'wrap', width: '100%'}}>
                      {
                        selectedReport === null && (
                          <Grid item container justify='center' alignItems='center' style={{height: 50}}>
                            <p className={classes.emptyText}>Không có dữ liệu.</p>
                          </Grid>
                        )
                      }
                      {
                        selectedReport !== null && (
                          <Tabs
                            value={classTabIndex}
                            onChange={handleTabIndexChange}
                            indicatorColor='primary'
                            textColor='primary'
                            variant='scrollable'
                            scrollButtons='auto'
                            aria-label='scrollable class list tab'
                            className={classes.classTabContainer}
                          >
                            {
                              selectedReport.dcpClassReports.map((el, i) => (
                                <Tab label={el.class.name} {...a11yProps(0)} />
                              ))
                            }
                          </Tabs>
                        )
                      }
                      
                    </Grid>
                    <Grid item style={{ flex: 1, minHeight: 0, minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }}>
                      {
                        selectedReport === null && (
                          <Grid item container justify='center' alignItems='center' style={{ height: '100%' }}>
                            <p className={classes.emptyText}>Không có dữ liệu.</p>
                          </Grid>
                        )
                      }
                      {
                        selectedReport && selectedReport.dcpClassReports.map((el, i) => (
                          <TabPanel index={i} activeIndex={classTabIndex} data={el.faults}/>
                        ))
                      }
                    </Grid>
                  </Grid>
                )
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default MyDCPReportPage;