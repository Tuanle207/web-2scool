import { Container, Grid, Button, makeStyles, List, ListItem, Typography, IconButton, Tooltip, Paper } from '@material-ui/core';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { DcpReport, Regulation } from '../common/interfaces';
import { DataGrid, GridApi, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { Alarm, CheckSharp, Clear, FindInPage, PermContactCalendar, Remove } from '@material-ui/icons';
import GroupIcon from '@material-ui/icons/Group';
import EditIcon from '@material-ui/icons/Edit';
import { DcpReportsService } from '../common/api';
import { formatTime, getDayOfWeek } from '../common/utils/TimeHelper';
import StudentList from '../components/Modal/StudentList';
import ActionModal from '../components/Modal';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import RestoreIcon from '@material-ui/icons/Restore';
import { dcpReportStatus, dcpReportStatusDic } from '../common/appConsts';

const useStyles = makeStyles(theme => ({
  container: {
    height: '100%',

    '& .MuiGrid-container': {
      flexWrap: 'nowrap'
    }
  },
  actionGroup: {
    padding: theme.spacing(2, 4),
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
      },
      '.MuiDataGrid-cell:focus': {
        outlineWidth: 0
      }
    },
    overflow: 'hidden'
  },
  dcpReportAction: {
    padding: theme.spacing(2), 
    borderTop: `1px solid ${theme.palette.divider}`
  },
  acceptBtn: {
    padding: theme.spacing(1,3),
  },
  rejectBtn: {
    padding: theme.spacing(1,3),
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  },
  classList: {
    width: '100%', 
    padding: theme.spacing(1),
    '& > li': {
      padding: 0,
      paddingRight: 16,
      // borderBottom: `1px solid ${theme.palette.grey[500]}`
      border: `1px solid ${theme.palette.grey[500]}`
    },
    '& > li:not(:last-child)': {
      marginBottom: theme.spacing(1)
    },
    '& > li:hover': {
      borderColor: theme.palette.primary.main,
      '& p, & button': {
        // color: theme.palette.common.white,
      }
    }
  },
  classItem: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    '& > p': {
      marginLeft: 16,
    },
    '& *': {
      flexWrap: 'wrap !important'
    }
  },
  activeSelectedItem: {
    // borderBottomColor: `${theme.palette.primary.main} !important`,
    borderColor: `${theme.palette.primary.main} !important`,
    '& p, & button': {
      color: theme.palette.primary.main
    },
  },
  emptySelectedList: {
    padding: theme.spacing(1, 4),
    '& > p': {
      color: theme.palette.grey[500]
    }
  },
}));

const cols: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Mã',
    // width: 0,
    hide: true
  },
  {
    field: 'regulation',
    headerName: 'Vi phạm',
    width: 200,
    valueFormatter: (params: GridValueFormatterParams) => {
      const item = params.value as Regulation.RegulationForSimpleListDto;
      return item.name;
    }
  },
  {
    field: 'criteria',
    headerName: 'Tiêu chí',
    width: 150,
    valueFormatter: (params: GridValueFormatterParams) => {
      const item = params.value as Regulation.CriteriaForSimpleList;
      return item.name;
    }
  },
  {
    field: 'points',
    headerName: 'Điểm',
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as number;
      return value;
    }
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
      const onClick = () => {
        const api: GridApi = params.api;
        console.log({x: params.getValue('id')});
      };

      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary' onClick={onClick}>
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

const DCPReportPage = () => {

  const classes = useStyles();
  const params = useParams<{dcpReportId: string}>();

  const [data, setData] = React.useState<DcpReport.DcpReportDto>({} as DcpReport.DcpReportDto);
  const [selectedClassId, setSelectedClassId] = React.useState<string | null>(null);

  React.useEffect(() => {
    document.title = '2Cool | Chi tiết phiếu chấm điểm nề nếp';

    fetchDcpReport();
  }, []);

  const fetchDcpReport = () => {
    const { dcpReportId } = params;
    if (!dcpReportId) {
      return;
    }

    DcpReportsService.getDcpReportById(dcpReportId).then(res => {
      setData(res);
      if (res.dcpClassReports && res.dcpClassReports.length > 0)  {
        setSelectedClassId(res.dcpClassReports[0].classId);
      }
    });
  } 

  const getFaults = (): DcpReport.DcpClassReportItemDto[] => {
    if (!data.dcpClassReports) {
      return [];
    }
    const items = data.dcpClassReports.find(x => x.classId === selectedClassId);
    const faults = items ? items.faults : [];
    return faults.map(el => ({
      ...el,
      criteria: el.regulation.criteria,
      points: -el.regulation.point
    }));
  };

  const handleAccept = () => {
    const { dcpReportId } = params;

    if (!dcpReportId) {
      return;
    }

    ActionModal.show({
      title: 'Phê duyệt phiếu chấm này?',
      onAccept: async () => {
        try {
          await DcpReportsService.acceptDcpReport([dcpReportId]);
          fetchDcpReport();
          toast('Phê duyệt thành công!', {
            type: 'success'
          });
        } catch (err) {
          console.log(err);
          toast('Đã có lỗi xảy ra!', {
            type: 'error'
          });
        }
      } 
    });
  };

  const handleReject = () => {
    const { dcpReportId } = params;

    if (!dcpReportId) {
      return;
    }

    ActionModal.show({
      title: 'Từ chối phiếu chấm này?',
      onAccept: async () => {
        try {
          await DcpReportsService.rejectDcpReport(dcpReportId);
          fetchDcpReport();
          toast('Từ chối thành công!', {
            type: 'success'
          });
        } catch (err) {
          console.log(err);
          toast('Đã có lỗi xảy ra!', {
            type: 'error'
          });
        }
      } 
    })
  };

  const handleCancelReject = () => {
    const { dcpReportId } = params;

    if (!dcpReportId) {
      return;
    }

    ActionModal.show({
      title: 'Bỏ duyệt phiếu chấm này?',
      onAccept: async () => {
        try {
          await DcpReportsService.cancelAssessDcpReport(dcpReportId);
          fetchDcpReport();
          toast('Bỏ duyệt thành công!', {
            type: 'success'
          });
        } catch (err) {
          console.log(err);
          toast('Đã có lỗi xảy ra!', {
            type: 'error'
          });
        }
      } 
    })
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={'dcp-report-approval'} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header />
          <Grid item container direction={'column'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container justify={'space-between'} className={classes.actionGroup}>
              <Grid item container direction={'row'} alignItems={'center'}>
                <Alarm style={{ marginRight: 8 }}/>
                <Typography variant={'body2'}>{data.creationTime ? `${getDayOfWeek(data.creationTime.toLocaleString())} - ${formatTime(data.creationTime.toLocaleString())}` : ''}</Typography>
              </Grid>
              <Grid item container direction={'row'} justify={'center'} alignItems={'center'}>
                <PermContactCalendar style={{ marginRight: 8 }}/>
                <Typography variant={'body2'}>{data.creator ? data.creator.name : ''}</Typography>
              </Grid>
              <Grid item container direction={'row'} justify={'center'} alignItems={'center'}>
                {
                  data.status === dcpReportStatus.Created ? <PauseCircleOutlineIcon style={{ marginRight: 8 }}/> :
                  data.status === dcpReportStatus.Approved ? <CheckCircleIcon style={{marginRight: 8}} /> :
                  <HighlightOffIcon style={{marginRight: 8}} />
                }
                <Typography variant={'body2'}>{dcpReportStatusDic[data.status]}</Typography>
              </Grid>
             
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              <Grid item style={{ minHeight: 0, overflowY: 'auto' }}>
                <Paper elevation={3} style={{width: '100%', height: '100%', minHeight: 0, overflowY: 'auto'}}>
                  <List className={classes.classList}>
                    {
                      (data.dcpClassReports || []).map((el, i) => (
                      <ListItem 
                        key={i} 
                        className={el.classId === selectedClassId ? classes.activeSelectedItem : ''}
                        style={{paddingRight: 8}}
                      >
                        <Grid 
                          container 
                          direction='column' 
                          alignItems='center' 
                          className={classes.classItem}
                          onClick={() => setSelectedClassId(el.classId)}
                        >
                          <Grid item container alignItems='center' direction='row'>
                            <GroupIcon color={selectedClassId === el.classId ? 'primary' : 'inherit'} style={{marginLeft: 16, marginRight: 8}} />
                            <p>{el.class.name}</p>
                          </Grid>
                          <Grid item container direction='row' justify='space-between' style={{marginTop: 8}}>
                            <Grid item container alignItems='center' direction='row' style={{width: 'auto'}}>
                              <Remove color={selectedClassId === el.classId ? 'primary' : 'inherit'} style={{marginLeft: 16, marginRight: 8}} />
                              <p>{el.penaltyTotal} điểm</p>
                            </Grid>
                            <Grid item container alignItems='center' direction='row'style={{width: 'auto'}}>
                              <EditIcon color={selectedClassId === el.classId ? 'primary' : 'inherit'} style={{marginLeft: 16, marginRight: 8}} />
                              <p>{el.faults.length} vi phạm</p>
                            </Grid>
                          </Grid>
                        </Grid>
                      </ListItem>))
                    }
                  </List>
                  {
                    selectedClassId && getFaults().length === 0 && (
                      <Grid container justify='center' alignItems='center' className={classes.emptySelectedList} >
                        <p>Chưa chọn lớp nào</p>
                      </Grid>
                    )
                  }
                </Paper>
              </Grid>
              <Grid item container direction={'column'} style={{ flex: 1, flexWrap: 'nowrap' }}>
                <Grid item style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                  <Container className={classes.datagridContainer}>
                    <DataGrid
                      columns={cols}
                      rows={getFaults()}
                      autoHeight
                      disableExtendRowFullWidth
                      hideFooterPagination
                      disableColumnFilter
                      disableColumnMenu
                      hideFooterSelectedRowCount
                      onCellClick={(params) => {
                        if (params.colIndex === 4) {
                          const students = params.getValue('relatedStudents') as DcpReport.DcpStudentReportDto[] || [];
                          ActionModal.show({
                            title: 'Danh sách học sinh vi phạm',
                            component: <StudentList students={students} />
                          });
                        }
                      }}
                    />
                  </Container>
                </Grid>
                <Grid item container justify={'flex-end'} className={classes.dcpReportAction}>
                  {
                    data.status === dcpReportStatus.Created && (
                      <Button 
                        className={classes.rejectBtn} 
                        startIcon={<Clear />}
                        onClick={handleReject}
                      >Từ chối</Button>
                    )                    
                  }
                  {
                     data.status === dcpReportStatus.Created && (
                      <Button 
                        className={classes.acceptBtn} 
                        startIcon={<CheckSharp/>}
                        variant={'contained'} 
                        color={'primary'}
                        onClick={handleAccept}
                      >Phê duyệt</Button>
                    )
                  }
                  {
                     [dcpReportStatus.Approved, dcpReportStatus.Rejected].includes(data.status) && (
                      <Button 
                        className={classes.rejectBtn} 
                        startIcon={<RestoreIcon />}
                        onClick={handleCancelReject}
                      >Bỏ duyệt</Button>
                    )
                  }
                  
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default DCPReportPage;