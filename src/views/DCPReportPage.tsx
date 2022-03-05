import { Grid, Button, Typography, IconButton, Tooltip, Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Class, DcpReport, Regulation } from '../interfaces';
import { DataGrid, GridColDef, GridValueFormatterParams } from '@material-ui/data-grid';
import { Alarm, CheckSharp, Clear, FindInPage, PermContactCalendar } from '@material-ui/icons';
import { DcpReportsService } from '../api';
import { formatFullDateTime } from '../utils/TimeHelper';
import StudentList from '../components/Modal/StudentList';
import ActionModal from '../components/Modal';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import RestoreIcon from '@material-ui/icons/Restore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { dcpReportStatus, dcpReportStatusDic, policies } from '../appConsts';
import { routes, routeWithParams } from '../routers/routesDictionary';
import { useSelector } from 'react-redux';
import { AppConfigSelector } from '../store/selectors';
import useStyles from '../assets/jss/views/DCPReportPage';
import { usePermissionChecker } from '../hooks';

const classCols: GridColDef[] = [
  {
    
    field: 'id',
    headerName: 'Mã',
    hide: true
  },
  {
    field: 'class',
    headerName: 'Lớp chấm',
    flex: 1,
    valueFormatter: (params: GridValueFormatterParams) => {
      const item = params.value as Class.ClassForSimpleListDto;
      return item.name;
    },
    hideSortIcons: true,
  }
];

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
    width: 70,
    align: 'center',
    headerAlign: 'center',
    valueFormatter: (params: GridValueFormatterParams) => {
      const value = params.value as number;
      return value;
    }
  },
  {
    field: 'relatedStudents',
    headerName: 'Học sinh vi phạm',
    width: 160,
    valueFormatter: (params: GridValueFormatterParams) => {
      const students = (params.value) as DcpReport.DcpStudentReportDto[];
      if (!students || students.length === 0) {
        return 'Trống';
      }
      return students.map(el => el.student.name).join(', ');
    }
  },
  {
    field: 'studentdetails',
    headerClassName: 'hiddenDataGridHeader',
    width: 80,
    renderCell: (params) => {
      return (
        <Tooltip title='Xem chi tiết'>
          <IconButton color='primary' >
            <FindInPage />
          </IconButton>
        </Tooltip>
      )
    }
  }
];

const DCPReportPage = () => {

  const history = useHistory();
  const classes = useStyles();
  const params = useParams<{dcpReportId: string}>();

  const [data, setData] = useState<DcpReport.DcpReportDto>({} as DcpReport.DcpReportDto);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [ loading, setLoading ] = useState(false);

  const [faults, setFaults] = useState<any[]>([]);
  const [className, setClassName] = useState<string>('Lớp...');
  const [faultsCount, setFaultsCount] =  useState('...');
  const [faultsPoint, setFaultsPoint] =  useState('...');

  const currentUser = useSelector(AppConfigSelector.currentUser);
  const haveDcpApprovalPermission = usePermissionChecker(policies.DcpReportApproval);
  const haveDcpUpdatePermission = usePermissionChecker(policies.UpdateDcpReport);
  const haveDcpRemovePermission = usePermissionChecker(policies.RemoveDcpReport);

  useEffect(() => {
    document.title = '2Cool | Chi tiết phiếu chấm điểm nề nếp';

    fetchDcpReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      setDisplayClassItem();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId]);

  const fetchDcpReport = async () => {
    try {
      setLoading(true);

      const { dcpReportId } = params;
      if (!dcpReportId) {
        return;
      }

      const res = await DcpReportsService.getDcpReportById(dcpReportId);
      setData(res);
      if (res.dcpClassReports && res.dcpClassReports.length > 0)  {
        setSelectedClassId(res.dcpClassReports[0].classId);
      }
    } finally {
      setLoading(false);
    }
    
  };

  const setDisplayClassItem = () => {
    const faultItems = getFaults();
    setFaults(faultItems);
    setFaultsCount(getFaultsCount().toString());
    setFaultsPoint(getFaultsPoint().toString());
    setClassName(getClass());
  };

  const getFaults = (): any[] => {
    if (!data.dcpClassReports) {
      return [];
    }
    const item = data.dcpClassReports.find(x => x.classId === selectedClassId);
    const faults = item ? item.faults : [];
    const result = faults.map(el => ({
      ...el,
      criteria: el.regulation.criteria,
      points: -el.regulation.point
    }));
    return result;
  };

  const getFaultsCount = () => {
    const faults = getFaults();
    const count = faults.length;
    return count;
  };

  const getFaultsPoint = () => {
    const faults = getFaults();
    let count = 0;
    faults.forEach((x) => {
      count += x.regulation.point;
    })
    return count;
  };

  const getClass = () => {
    if (!data.dcpClassReports) {
      return '';
    }
    const item = data.dcpClassReports.find(x => x.classId === selectedClassId);
    return item?.class.name || '';
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
    });
  };

  const handleEdit = () =>  {
    const { dcpReportId } = params;

    if (!dcpReportId) {
      return;
    }

    history.push(routeWithParams(routes.UpdateDCPReport, dcpReportId));
  };

  const handleDelete = () => {
    const { dcpReportId } = params;

    if (!dcpReportId) {
      return;
    }

    ActionModal.show({
      title: 'Xóa phiếu chấm này?',
      onAccept: async () => {
        try {
          await DcpReportsService.deleteDcpReportById(dcpReportId);
          fetchDcpReport();
          toast('Xóa thành công!', {
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
          <Sidebar activeKey={routes.DCPReportDetail} />
        </Grid>
        <Grid style={{ background: '#fff', flexGrow: 1}} item container xs={8} sm={9} md={10} direction={'column'}>
          <Grid item>
            <Header pageName="Chi tiết phiếu chấm nề nếp" />
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
                <Grid item container direction='row' alignItems='center' style={{ padding: "5px 32px", height: 54 }}>
                  <Grid item container direction={'row'} alignItems={'center'}>
                    <Alarm style={{ marginRight: 8 }}/>
                    <Typography variant={'body2'}>{data.creationTime ? formatFullDateTime(data.creationTime.toLocaleString()) : ''}</Typography>
                  </Grid>
                  <Grid item container direction={'row'} justify={'center'} alignItems={'center'}>
                    <PermContactCalendar style={{ marginRight: 8 }}/>
                    <Typography variant={'body2'}>{data.creator ? `Được chấm bởi ${data.creator.name}` : ''}</Typography>
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
              </Paper>
            </Grid>              
            <Grid item container direction="row" style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: '16px 24px' }}>
              <Grid item style={{ width: 140, height: '100%', marginRight: 16 }} className={`${classes.root} ${classes.classRoot}`}>
                <DataGrid
                  columns={classCols}
                  rows={data.dcpClassReports || []}
                  autoHeight
                  disableExtendRowFullWidth
                  disableColumnFilter
                  disableColumnMenu
                  loading={loading}
                  hideFooter
                  onCellClick={async (params) => {
                    const classId = params.getValue('classId') as string;
                    setSelectedClassId(classId);
                  }}
                />
              </Grid>
              <Grid item container direction="column" style={{ flex: 1, height: '100%' }}>
                <Grid item container direction="row" justify="space-between" alignItems="center" className={classes.classDetail}>
                  <Typography variant={'body2'}>{`${className}`}</Typography>
                  <Typography variant={'body2'}>{`Số lỗi: ${faultsCount}`}</Typography>
                  <Typography variant={'body2'}>{`Số điểm trừ: ${faultsPoint}`}</Typography>
                </Grid>
                <Grid item container style={{ flex: 1 }} className={classes.root} >
                  <DataGrid
                    columns={cols}
                    rows={faults}
                    loading={loading}
                    disableExtendRowFullWidth
                    disableColumnFilter
                    disableColumnMenu
                    hideFooter
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
                </Grid>
                <Grid item container justify="flex-end" className={classes.dcpReportAction} >
                  {
                    haveDcpRemovePermission &&(data.creatorId === currentUser.id &&  data.status === dcpReportStatus.Created) && (
                      <Button 
                        className={`${classes.rejectBtn} ${classes.acceptBtn}`} 
                        style={{ marginRight: 16 }}
                        variant={'contained'} 
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                      >Xóa</Button>
                    )
                  }
                  {
                    haveDcpUpdatePermission &&(data.creatorId === currentUser.id &&  data.status === dcpReportStatus.Created) && (
                      <Button
                        style={{ marginRight: 16 }}
                        variant={'contained'} 
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                      >Cập nhật</Button>
                    )
                  }
                  {
                    haveDcpApprovalPermission && data.status === dcpReportStatus.Created && (
                      <Button 
                        className={classes.rejectBtn} 
                        startIcon={<Clear />}
                        onClick={handleReject}
                      >Từ chối</Button>
                    )                    
                  }
                  {
                     haveDcpApprovalPermission && data.status === dcpReportStatus.Created && (
                      <Button 
                        className={classes.acceptBtn} 
                        startIcon={<CheckSharp/>}
                        variant={'contained'} 
                        color={'primary'}
                        onClick={handleAccept}
                      >Chấp nhận</Button>
                    )
                  }
                  {
                     haveDcpApprovalPermission && [dcpReportStatus.Approved, dcpReportStatus.Rejected].includes(data.status) && (
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