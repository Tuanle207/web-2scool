/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Box, Button, makeStyles, InputLabel, Select, Typography, Tabs, Tab, IconButton, Chip, Tooltip, FormControl, MenuItem } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { DcpReport, Regulation, Stats } from '../common/interfaces';
import { DataGrid, GridColDef, GridRowData, GridValueFormatterParams } from '@material-ui/data-grid';
import { DcpReportsService, StatisticsService } from '../common/api';
import { usePagingInfo, useFetch } from '../hooks';
import { formatDate, getDayOfWeek, addDays, getPreviousMonday } from '../common/utils/TimeHelper';
import SettingsIcon from '@material-ui/icons/Settings';
import ActionModal from '../components/Modal';
import { toast } from 'react-toastify';
import { comparers } from '../common/appConsts';
import { FindInPage } from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import { sleep } from '../common/utils/SetTimeOut';


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
    '& .MuiDataGrid-root.MuiDataGrid-colCellMoving': {
      backgroundColor: 'inherit'
    }
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
  statisticsTypeSelector: {
    width: 150,
    '& .MuiSelect-select:focus': {
      backgroundColor: 'unset'
    }
  }
}));

const classFaultsStatsCols: GridColDef[] = [
  {
    field: 'classId',
    headerName: 'Mã lớp',
    hide: true
  },
  {
    field: 'className',
    headerName: 'Lớp',
    width: 150,
  },
  {
    field: 'formTeacherName',
    headerName: 'Giáo viên chủ nhiệm',
    flex: 1
  },
  {
    field: 'faults',
    headerName: 'Lượt vi phạm',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'penaltyPoints',
    headerName: 'Tổng điểm trừ',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'Chi tiết',
    disableClickEventBubbling: true,
    hideSortIcons: true,
    align: 'center',
    renderCell: (params) => {
      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary'>
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

const commonFaultsStasCols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Mã quy định',
    width: 150
  },
  {
    field: 'name',
    headerName: 'Tên Vi phạm',
    flex: 1
  },
  {
    field: 'criteriaName',
    headerName: 'Tiêu chí',
    width: 200
  },
  {
    field: 'faults',
    headerName: 'Lượt vi phạm',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'Chi tiết',
    disableClickEventBubbling: true,
    hideSortIcons: true,
    align: 'center',
    renderCell: (params) => {
      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary'>
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

const studentsWithMostFaultsStasCols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Mã học sinh',
    width: 150
  },
  {
    field: 'studentName',
    headerName: 'Tên học sinh',
    flex: 1
  },
  {
    field: 'className',
    headerName: 'Thuộc lớp',
    width: 120,
  },
  {
    field: 'faults',
    headerName: 'Lượt vi phạm',
    width: 150,
    align: 'center',
    headerAlign: 'right'
  },
  {
    field: 'Chi tiết',
    disableClickEventBubbling: true,
    hideSortIcons: true,
    align: 'center',
    renderCell: (params) => {
      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary'>
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

type StatsType = 'ClassFaults' | 'CommonFaults' | 'StudentWithMostFaults';
type ViewType = 'ByWeek' | 'ByMonth' | 'BySemester';

const DCPStatisticsPage = () => {

  const classes = useStyles();
  const history = useHistory();

  const [dateFilter, setDateFilter] = React.useState<{
    startTime: Date | null,
    endTime: Date | null
  }>({startTime: getPreviousMonday(new Date()), endTime: new Date()})


  const [classFaultsStats, setClassFaultsStats] 
    = React.useState<Stats.DcpClassFault[]>([]);
  const [commonFaultsStats, setCommonFaultsStats] 
    = React.useState<Stats.CommonDcpFault[]>([]);
  const [studentsWithMostFaultsStats, setStudentsWithMostFaultsStats] 
    = React.useState<Stats.StudentWithMostFaults[]>([]);
  const [loading, setLoading] = React.useState(false);

  
  const [statsType, setStatsType] = React.useState<StatsType>('ClassFaults');
  const [viewType, setViewType] = React.useState<ViewType>('ByWeek');

  React.useEffect(() => {
    document.title = '2Cool | Thống kê nề nếp';
  }, []);

  React.useEffect(() => {
    if (dateFilter && dateFilter.startTime && dateFilter.endTime)  {
      fetchData();
    }
  }, [dateFilter]);

  const handleWeekFilter = () => {
    const startTime = getPreviousMonday(new Date());
    const endTime = new Date();
    setDateFilter({
      startTime,
      endTime
    });
  };

  const handleMonthFilter = () => {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), 1);
    const endTime = now;
    setDateFilter({
      startTime,
      endTime
    });
  };

  const handleSemesterFilter = () => {
    const now = new Date();
    if (now.getMonth() < 1) {
      // TODO: GET START TIME BY GETTING COURSE INFOMATION, STORE SEMESTER INFORMATION
      const startTime = new Date(now.getFullYear() - 1, 8, 5);
      const endTime = now;
      setDateFilter({
        startTime,
        endTime
      });
    } else {
      const startTime = new Date(now.getFullYear(), 1, 1);
      const endTime = now;
      setDateFilter({
        startTime,
        endTime
      });
    }
  };

  const handleViewTypeChange = (mode: ViewType) => {
    if (mode !== viewType) {
      setViewType(mode);

      switch (mode) {
        case 'ByWeek': 
          handleWeekFilter();
          break;
        case 'ByMonth': 
          handleMonthFilter();
          break;
        case 'BySemester': 
          handleSemesterFilter();
          break;
        default: 
          handleWeekFilter();
      }
    }
  };
  const handleStatsTypeChange = (e: ChangeEvent<any>) => {
    const value = e.target.value as StatsType;
    if (value !== statsType) {
      setViewType('ByWeek');
      setStatsType(value);
      handleWeekFilter();
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await sleep(200);
      const fns: {fetchFn: Function; setState: Function;} = {
        fetchFn: StatisticsService.getClassesFaults,
        setState: setClassFaultsStats
      };
      switch (statsType) {
        case 'ClassFaults':
          fns.fetchFn = StatisticsService.getClassesFaults;
          fns.setState = setClassFaultsStats;
          break;
        case 'CommonFaults':
          fns.fetchFn = StatisticsService.getCommonFaults;
          fns.setState = setCommonFaultsStats;
          break;
        case 'StudentWithMostFaults':
          fns.fetchFn = StatisticsService.getStudentsWithMostFaults;
          fns.setState = setStudentsWithMostFaultsStats;
          break;
        default:
          fns.fetchFn = StatisticsService.getClassesFaults;
          fns.setState = setClassFaultsStats;
          break;
      };

      const res = await fns.fetchFn({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });

      fns.setState(res.items);  
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = () => {
    if (statsType === 'ClassFaults') {
      StatisticsService.getClassesFaultsExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    } else if (statsType === 'CommonFaults') {
      StatisticsService.getCommonFaultsExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    } else if (statsType === 'StudentWithMostFaults') {
      StatisticsService.getStudentsWithMostFaultsExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    } else {
      StatisticsService.getClassesFaultsExcel({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
    }
  }

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'dcp-statistics'} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify='space-between' alignItems='center' className={classes.actionGroup}>
              <Grid item container direction='row' alignItems='center' >
                <FormControl className={classes.statisticsTypeSelector}>
                  <InputLabel id="statistics-type-select">Loại thống kê</InputLabel>
                  <Select
                    labelId="statistics-type-select"
                    id="demo-simple-select"
                    value={statsType}
                    onChange={handleStatsTypeChange}
                  >
                    <MenuItem value={'ClassFaults'}>Lớp vi phạm</MenuItem>
                    <MenuItem value={'CommonFaults'}>Lỗi vi phạm</MenuItem>
                    <MenuItem value={'StudentWithMostFaults'}>Học sinh vi phạm</MenuItem>
                  </Select>
                </FormControl>
                <Chip 
                  clickable label='Thống kê tuần' 
                  onClick={() => handleViewTypeChange('ByWeek')}
                  variant={viewType === 'ByWeek' ? 'default' : 'outlined'} 
                  color={viewType === 'ByWeek' ? 'primary' : 'default'} style={{marginLeft: 16}}
                  />
                <Chip clickable label='Thống kê tháng' 
                  onClick={() => handleViewTypeChange('ByMonth')}
                  variant={viewType === 'ByMonth' ? 'default' : 'outlined'} 
                  color={viewType === 'ByMonth' ? 'primary' : 'default'}
                  style={{marginLeft: 8}}
                />
                <Chip clickable label='Thống kê học kỳ' 
                  onClick={() => handleViewTypeChange('BySemester')}
                  variant={viewType === 'BySemester' ? 'default' : 'outlined'} 
                  color={viewType === 'BySemester' ? 'primary' : 'default'}
                  style={{marginLeft: 8, marginRight: 16}}
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Box>
                    <KeyboardDatePicker
                      style={{width: 150}}
                      disableToolbar
                      fullWidth
                      size='small'
                      variant='inline'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-stats-report-start'
                      label='Bắt đầu từ'
                      value={dateFilter.startTime}
                      onChange={() => {}}
                      KeyboardButtonProps={{
                        'aria-label': 'dcp - rankings - start end date',
                      }}
                    />
                  </Box>
                  <Box>
                    <KeyboardDatePicker
                      style={{width: 150}}
                      disableToolbar
                      fullWidth
                      size='small'
                      variant='inline'
                      format='dd/MM/yyyy'
                      margin='dense'
                      id='get-stats-report-end'
                      label='Đến ngày'
                      value={dateFilter.endTime}
                      onChange={() => {}}
                      KeyboardButtonProps={{
                        'aria-label': 'dcp - rankings - change end date',
                      }}
                    />
                  </Box>
                </MuiPickersUtilsProvider>

                <Tooltip title='Lưu thành báo cáo' style={{marginLeft: 'auto'}} onClick={handleDownloadFile}>
                  <IconButton color='primary' aria-label='Tải báo cáo'>
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
      
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              <Container className={classes.datagridContainer}>
                {
                  statsType === 'ClassFaults' && (
                    <DataGrid
                      columns={classFaultsStatsCols}
                      rows={classFaultsStats}
                      getRowId={(row: GridRowData) => (row as any).classId}
                      paginationMode='server'
                      hideFooterPagination
                      loading={loading}
                      hideFooter
                    />
                  )
                }
                {
                  statsType === 'CommonFaults' && (
                    <DataGrid
                      columns={commonFaultsStasCols}
                      rows={commonFaultsStats}
                      paginationMode='server'
                      hideFooterPagination
                      loading={loading}
                      hideFooter
                    />
                  )
                }
                {
                  statsType === 'StudentWithMostFaults' && (
                    <DataGrid
                      columns={studentsWithMostFaultsStasCols}
                      rows={studentsWithMostFaultsStats}
                      paginationMode='server'
                      hideFooterPagination
                      loading={loading}
                      hideFooter
                    />
                  )
                }
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DCPStatisticsPage;