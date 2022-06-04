/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Box, Select,
  IconButton, Chip, Tooltip, FormControl, MenuItem, Paper, Badge } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import React, { ChangeEvent } from 'react';
import Header from '../components/Header';
import { DataGrid, GridColDef, GridRowData } from '@material-ui/data-grid';
import { StatisticsService } from '../api';
import { getPreviousMonday } from '../utils/TimeHelper';
import { FindInPage } from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ReactComponent as FilterIcon } from '../assets/img/filter.svg';
import { sleep } from '../utils/SetTimeOut';
import { Stats } from '../interfaces';
import useStyles from '../assets/jss/views/DCPStatisticsPage';
import { dataGridLocale } from '../appConsts';


const classFaultsStatsCols: GridColDef[] = [
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
    field: 'name',
    headerName: 'Tên Vi phạm',
    width: 300,
    flex: 2,
  },
  {
    field: 'criteriaName',
    headerName: 'Tiêu chí',
    width: 200,
    flex: 1,
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
    sortable: false,
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
    document.title = '2Scool | Thống kê nề nếp';
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
      setStatsType(value);
      setViewType('ByWeek');
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
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction="column" >
      <Grid item >
        <Header
          pageName="Thống kê nề nếp"
        />
      </Grid>
      <Grid item container direction="column" style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', background: "#e8e8e8" }}>
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
                  <Badge color="primary" >
                    <FilterIcon fontSize="small" />
                  </Badge>
              </Tooltip>
              <FormControl className={classes.statisticsTypeSelector}>
                <Select
                  labelId="statistics-type-select"
                  id="simple-select"
                  value={statsType}
                  onChange={handleStatsTypeChange}
                  placeholder="Loại vi phạm"
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
                    placeholder='Bắt đầu từ'
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
                    placeholder='Đến ngày'
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
          </Paper>
        </Grid>              
        <Grid item style={{ flexGrow: 1, paddingTop: 16, paddingBottom: 16, backgroundColor: '#e8e8e8'}}>
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
                  localeText={dataGridLocale}
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
                  localeText={dataGridLocale}
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
                  localeText={dataGridLocale}
                />
              )
            }
          </Container>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DCPStatisticsPage;