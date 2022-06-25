/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Grid, Box, Select,
  IconButton, Chip, Tooltip, FormControl, MenuItem, Paper, Badge } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { DataGrid, GridApi, GridColDef, GridRowData, GridRowId } from '@material-ui/data-grid';
import { StatisticsService } from '../api';
import { formatFullDateTimeWithoutTime, getLatestMonday } from '../utils/TimeHelper';
import { FindInPage } from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { ReactComponent as FilterIcon } from '../assets/img/filter.svg';
import { sleep } from '../utils/SetTimeOut';
import { Stats } from '../interfaces';
import useStyles from '../assets/jss/views/DCPStatisticsPage';
import { dataGridLocale } from '../appConsts';
import { busyService, dialogService } from '../services';
import StatsDetailView, { StatsDetailViewProps } from '../components/Modal/StatsDetailView';
import { toast } from 'react-toastify';

interface RowMenuProps {
  api: GridApi;
  id: GridRowId;
}

const ClassRowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const onDetailClick = async () => {
    try {
      busyService.busy(true);
      const classId = id.toString();
      const className = (api as GridApi).getCellValue(id, 'className');
      const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
      const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;

      const input: StatsDetailViewProps = {
        dataType: 'ClassFaultDetail',
        data: (await StatisticsService.getClassFaultDetails(classId, {
          startTime,
          endTime,
        })).items,
      };
  
      dialogService.show(input, {
        title: `Chi tiết vi phạm ${className} từ ${formatFullDateTimeWithoutTime(startTime.toLocaleString())} đến ${formatFullDateTimeWithoutTime(endTime.toLocaleString())}`,
        renderFormComponent: StatsDetailView,
        noCancelButton: true,
        acceptText: 'Đóng',
        type: 'data',
        height: '50vh'
      });
    } catch {
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      busyService.busy(false);
    }
  };

  const onDownloadClick = async () => {
    const classId = id.toString();
    const className = (api as GridApi).getCellValue(id, 'className')?.toString();
    const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
    const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;
    await StatisticsService.getClassFaultDetailsExcel(classId, className || '', { startTime, endTime});
  };

  const handleSendReportThroughMail = async () => {
    const classId = id.toString();
    const className = (api as GridApi).getCellValue(id, 'className');
    const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
    const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;

    const { result } = await dialogService.show(null, {
      title: `Xác nhận gửi email báo cáo tới giáo viên chủ nhiệm ${className}?`
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true)
      await StatisticsService.sendClassFaultsThroughEmail({ startTime, endTime }, classId);
      toast.info(`Email đang được gửi tới giáo viên chủ nhiệm ${className}`);
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể gửi email!');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <>
      <Tooltip title='Xem chi tiết'>
        <IconButton color="primary" size="small" onClick={onDetailClick}>
          <FindInPage fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title='Tải báo cáo chi tiết'>
        <IconButton color="primary" size="small" onClick={onDownloadClick}>
          <GetAppIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip 
        title='Gửi mail báo cáo cho GVCN'
        onClick={handleSendReportThroughMail}
      >
        <IconButton color='primary' size="small" onClick={handleSendReportThroughMail}>
          <MailOutlineIcon  fontSize="small"/>
        </IconButton>
      </Tooltip>
    </>
  );
};

const RegulationRowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const onDetailClick = async () => {
    try {
      busyService.busy(true);
      const regulationId = id.toString();
      const regulationName = (api as GridApi).getCellValue(id, 'name');
      const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
      const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;

      const input: StatsDetailViewProps = {
        dataType: 'RegulationFaultDetail',
        data: (await StatisticsService.getRegulationFaultDetails(regulationId, {
          startTime,
          endTime,
        })).items,
      };

      dialogService.show(input, {
        title: `Chi tiết vi phạm ${regulationName} từ ${formatFullDateTimeWithoutTime(startTime.toLocaleString())} đến ${formatFullDateTimeWithoutTime(endTime.toLocaleString())}`,
        renderFormComponent: StatsDetailView,
        noCancelButton: true,
        acceptText: 'Đóng',
        type: 'data',
        height: '50vh'
      });
    } catch {
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      busyService.busy(false);
    }
  };

  const onDownloadClick = async () => {
    const regulationId = id.toString();
    const regulationName = (api as GridApi).getCellValue(id, 'name')?.toString();
    const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
    const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;
    await StatisticsService.getRegulationFaultDetailsExcel(regulationId, regulationName || '', { startTime, endTime});
  };

  return (
    <>
      <Tooltip title='Xem chi tiết'>
        <IconButton color="primary" size="small" onClick={onDetailClick}>
          <FindInPage fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title='Tải báo cáo chi tiết'>
        <IconButton color="primary" size="small" onClick={onDownloadClick}>
          <GetAppIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

const StudentRowMenuCell = (props: RowMenuProps) => {
  const { api, id } = props;

  const onDetailClick = async () => {
    try {
      busyService.busy(true);
      const studentId = id.toString();
      const studentName = (api as GridApi).getCellValue(id, 'studentName');
      const className = (api as GridApi).getCellValue(id, 'className');
      const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
      const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;

      const input: StatsDetailViewProps = {
        dataType: 'StudentFaultDetail',
        data: (await StatisticsService.getStudentFaultDetails(studentId, {
          startTime,
          endTime,
        })).items,
      };

      dialogService.show(input, {
        title: `Chi tiết vi phạm của học sinh ${studentName} - ${className} từ ${formatFullDateTimeWithoutTime(startTime.toLocaleString())} đến ${formatFullDateTimeWithoutTime(endTime.toLocaleString())}`,
        renderFormComponent: StatsDetailView,
        noCancelButton: true,
        acceptText: 'Đóng',
        type: 'data',
        height: '50vh'
      });
    } catch {
      toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      busyService.busy(false);
    }
  };

  const onDownloadClick = async () => {
    const studentId = id.toString();
    const studentName = (api as GridApi).getCellValue(id, 'studentName')?.toString();
    const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
    const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;
    await StatisticsService.getStudentFaultDetailsExcel(studentId, studentName || '', { startTime, endTime});
  };

  const handleSendReportThroughMail = async () => {
    const classId = id.toString();
    const className = (api as GridApi).getCellValue(id, 'className');
    const startTime = (api as GridApi).getCellValue(id, 'startTime') as Date;
    const endTime = (api as GridApi).getCellValue(id, 'endTime') as Date;

    const { result } = await dialogService.show(null, {
      title: `Xác nhận gửi email báo cáo tới giáo viên chủ nhiệm ${className}?`
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      busyService.busy(true)
      await StatisticsService.sendStudentFaultsThroughEmail({ startTime, endTime }, classId);
      toast.info(`Email đang được gửi tới giáo viên chủ nhiệm ${className}`);
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể gửi email!');
    } finally {
      busyService.busy(false);
    }
  };

  return (
    <>
      <Tooltip title='Xem chi tiết'>
        <IconButton color="primary" size="small" onClick={onDetailClick}>
          <FindInPage fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title='Tải báo cáo chi tiết'>
        <IconButton color="primary" size="small" onClick={onDownloadClick}>
          <GetAppIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip 
        title='Gửi mail báo cáo cho GVCN'
        onClick={handleSendReportThroughMail}
      >
        <IconButton color='primary' size="small" onClick={handleSendReportThroughMail}>
          <MailOutlineIcon  fontSize="small"/>
        </IconButton>
      </Tooltip>
    </>
  );
};

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
    field: 'startTime',
    hide: true,
  },
  {
    field: 'endTime',
    hide: true,
  },
  {
    field: 'Chi tiết',
    disableClickEventBubbling: true,
    hideSortIcons: true,
    align: 'center',
    renderCell: ClassRowMenuCell,
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
    renderCell: RegulationRowMenuCell,
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
    renderCell: StudentRowMenuCell,
  }
];

type StatsType = 'ClassFaults' | 'CommonFaults' | 'StudentWithMostFaults';
type ViewType = 'ByWeek' | 'ByMonth' | 'BySemester' | 'Custom';

interface DcpClassFaultExtension extends Stats.DcpClassRanking {
  startTime: Date;
  endTime: Date;
}

interface DcpCommonFaultExtension extends Stats.CommonDcpFault {
  startTime: Date;
  endTime: Date;
}

interface DcpStudentFaultExtension extends Stats.StudentWithMostFaults {
  startTime: Date;
  endTime: Date;
}

const DCPStatisticsPage = () => {

  const classes = useStyles();

  const [dateFilter, setDateFilter] = useState<{
    startTime: Date | null,
    endTime: Date | null
  }>({startTime: getLatestMonday(), endTime: new Date()})


  const [classFaultsStats, setClassFaultsStats] = useState<DcpClassFaultExtension[]>([]);
  const [commonFaultsStats, setCommonFaultsStats] = useState<DcpCommonFaultExtension[]>([]);
  const [studentsWithMostFaultsStats, setStudentsWithMostFaultsStats] = useState<DcpStudentFaultExtension[]>([]);
  const [loading, setLoading] = useState(false);

  const [textFilter, setTextFilter] = useState('');
  
  const [statsType, setStatsType] = useState<StatsType>('ClassFaults');
  const [viewType, setViewType] = useState<ViewType>('ByWeek');

  useEffect(() => {
    document.title = '2Scool | Thống kê nề nếp';
  }, []);

  useEffect(() => {
    if (dateFilter && dateFilter.startTime && dateFilter.endTime)  {
      fetchData();
    }
  }, [dateFilter]);

  const handleWeekFilter = () => {
    const startTime = getLatestMonday(new Date());
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

      fns.setState(res.items.map((x: any) => ({
        ...x,
        startTime: dateFilter.startTime,
        endTime: dateFilter.endTime,
      })));  
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
  };

  const handleSendReportThroughMail = async () => {
    if (statsType !== 'ClassFaults') {
      return;
    }
    const { result } = await dialogService.show(null, {
      title: `Xác nhận gửi email báo cáo vi phạm các lớp tới các giáo viên chủ nhiệm?`
    });
    if (result !== 'Ok') {
      return;
    }
    try {
      await StatisticsService.sendClassFaultsThroughEmail({
        startTime: dateFilter.startTime!,
        endTime: dateFilter.endTime!
      });
      toast.info('Email đang được gửi tới các giáo viên chủ nhiệm');
    } catch {
      toast.error('Đã có lỗi xảy ra. Không thể gửi email!');
    }
  };

  const filterByCustomDates = (dateField: string, date: Date | null) => {
    setDateFilter((prev) => ({
      ...dateFilter,
      [dateField]: date
    }));
    setViewType('Custom');
  };

  const searchPlaceholder = useMemo(() => {
    switch (statsType) {
      case 'ClassFaults':
        return 'Tìm kiếm lớp...';
      case 'CommonFaults':
        return 'Tìm kiếm quy định...';
      case 'StudentWithMostFaults':
        return 'Tìm kiếm học sinh...';
      default:
      return 'Tìm kiếm...';
    }
  }, [statsType]);

  return (
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction="column" >
      <Grid item >
        <Header
          pageName="Thống kê nề nếp"
          searchBarPlaceholder={searchPlaceholder}
          onTextChange={(text) => setTextFilter(text)}
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
                    onChange={(date) => filterByCustomDates('startTime', date)}
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
                    onChange={(date) => filterByCustomDates('endTime', date)}
                    KeyboardButtonProps={{
                      'aria-label': 'dcp - rankings - change end date',
                    }}
                  />
                </Box>
              </MuiPickersUtilsProvider>
              <Tooltip 
                title='Gửi mail báo cáo cho GVCN các lớp' 
                style={{marginLeft: 'auto', visibility: statsType === 'ClassFaults' ? 'visible' : 'hidden'}} 
                onClick={handleSendReportThroughMail}
              >
                <IconButton color='primary' aria-label='Gửi mail báo cáo'>
                  <MailOutlineIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Lưu thành báo cáo' onClick={handleDownloadFile}>
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
                  rows={classFaultsStats.filter(x => x.className.includes(textFilter))}
                  getRowId={(row: GridRowData) => (row as Stats.DcpClassFault).classId}
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
                  rows={commonFaultsStats.filter(x => x.name.includes(textFilter))}
                  getRowId={(row: GridRowData) => (row as Stats.CommonDcpFault).id}
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
                  rows={studentsWithMostFaultsStats.filter(x => x.studentName.includes(textFilter))}
                  getRowId={(row: GridRowData) => (row as Stats.StudentWithMostFaults).id}
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