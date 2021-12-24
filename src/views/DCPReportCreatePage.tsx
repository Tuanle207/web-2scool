/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Grid, Button, TextField, ListItem, Paper, Chip, List, IconButton } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import SendIcon from '@material-ui/icons/Send';
import ScheduleIcon from '@material-ui/icons/Schedule';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import GroupIcon from '@material-ui/icons/Group';
import CreateIcon from '@material-ui/icons/Create';
import { Class, Student, Regulation, DcpReport, Util } from '../interfaces';
import { RegulationsService, StudentsService, TaskAssignmentService } from '../api';
import { withRedux } from '../utils/ReduxConnect';
import { DcpReportActions } from '../store/actions';
import { formatTime } from '../utils/TimeHelper';
import ActionModal from '../components/Modal';
import { taskType } from '../appConsts';
import { routes } from '../routers/routesDictionary';
import useStyles from '../assets/jss/views/DCPReportCreatePage';

interface Props {
  dcpReport: DcpReport.CreateUpdateDcpReportDto;
  sendingDcpReport: boolean;
  addClassToReport: (classId: string) => void;
  removeClassFromReport: (classId: string) => void;
  addFaultToClass: (payload: {classId: string; regulationId: string}) => void;
  removeFaultFromClass: (payload: {classId: string; regulationId: string;}) => void;
  addStudentToFault: (payload: {classId: string; regulationId: string; studentId: string;}) => void;
  removeStudentFromFault: (payload: {classId: string; regulationId: string; studentId: string; }) => void;
  sendDcpReport: () => void;
}

const DCPReportCreatePage: React.FC<Props> = ({
  dcpReport,
  sendingDcpReport,
  addClassToReport,
  removeClassFromReport,
  addFaultToClass,
  removeFaultFromClass,
  addStudentToFault,
  removeStudentFromFault,
  sendDcpReport
}) => {
  
  const classes = useStyles(); 
  const history = useHistory();

  const [classOptions, setClassOptions] = 
    React.useState<Class.ClassForSimpleListDto[]>([]);
  const [criteriaOptions, setCriteriaOptions] = 
    React.useState<Regulation.CriteriaForSimpleList[]>([]);
  const [regulationOptions, setRegulationsOptions] = 
    React.useState<Regulation.RegulationForSimpleListDto[]>([]);
  const [studentOptions, setStudentOptions] = 
    React.useState<Util.IObject<Student.StudentForSimpleListDto[]>>({});

  const [currentClass, setCurrentClass] = 
    React.useState<Class.ClassForSimpleListDto | null>(null);
  const [currentRegulation, setCurrentRegulation] = 
    React.useState<Regulation.RegulationForSimpleListDto | null>(null);
  const [currentCriteia, setCurrentCriteria] = 
    React.useState<Regulation.CriteriaForSimpleList | null>(null);
  const [currentStudent, setCurrentStudent] = 
    React.useState<Student.StudentForSimpleListDto | null>(null);

  const [selectedClassId, setSelectedClassId] = 
    React.useState<string | null>(null);
  const [selectedRegulationId, setSelectedRegulationId] = 
    React.useState<string | null>(null);

  const [isAddingStudent, setIsAddingStudent] = React.useState(false);
  const [dcpReportSent, setDcpReportSent] = React.useState(false); 

  React.useEffect(() => {
    const initData = async () =>  {
      const requestApi: Promise<any>[] = [
        TaskAssignmentService.getAssignedClassesForDcpReport(taskType.DcpReport),
        RegulationsService.getCriteriaForSimpleList(),
        RegulationsService.getRegulationForSimpleList(),
      ];

      const [classesRes, criteriasRes, regulationsRes] = await Promise.all(requestApi);

      const classes = classesRes.items as Class.ClassForSimpleListDto[];
      const criterias = criteriasRes.items as Regulation.CriteriaForSimpleList[];
      const regulations = regulationsRes.items as Regulation.RegulationForSimpleListDto[];

      setClassOptions(classes);
      setRegulationsOptions(regulations);
      setCriteriaOptions(criterias);
    };

    initData();

    document.title = '2Cool | Chấm điểm nề nếp';
  }, []);

  React.useEffect(() => {
    if (selectedClassId !== null && !studentOptions[selectedClassId]) {
      StudentsService.getStudentForSimpleList(selectedClassId)
        .then(res => {
          const options = {...studentOptions};
          options[selectedClassId] = res.items;
          setStudentOptions(options);
        });
    }
    setCurrentStudent(null);
  }, [selectedClassId]);

  React.useEffect(() => {
    if (dcpReportSent && !sendingDcpReport) {
      history.goBack();
    }
    setDcpReportSent(sendingDcpReport);
  }, [sendingDcpReport]);

  const handleAddStudentView = (regulationId: string) => {
    setSelectedRegulationId(regulationId);
    setIsAddingStudent(true);
  }

  const handleAddClass = () => {
    if (currentClass === null) {
      return;
    }
    if (dcpReport.dcpClassReports.length === 0) {
      setSelectedClassId(currentClass.id);
    }
    addClassToReport(currentClass.id);
  };
  const handleRemoveClass = (classId: string) => {
    removeClassFromReport(classId);
    if (classId === selectedClassId) {
      setSelectedClassId(null);
    }
  };
  const handleAddFault = () => {
    if (selectedClassId === null || currentRegulation === null) {
      return;
    }
    const dcpClassReport = dcpReport.dcpClassReports.find(x => x.classId === selectedClassId);
    if (!dcpClassReport) {
      return;
    }
    if (dcpClassReport.faults.length === 0) {
      setSelectedRegulationId(currentRegulation.id);
    }
    addFaultToClass({
      classId: selectedClassId,
      regulationId: currentRegulation.id
    });
  }
  const handleRemoveFault = (regulationId: string) => {
    if (selectedClassId === null) {
      return;
    }
    const dcpClassReport = dcpReport.dcpClassReports.find(x => x.classId === selectedClassId);
    if (!dcpClassReport) {
      return;
    }
    removeFaultFromClass({
      classId: selectedClassId,
      regulationId: regulationId
    });
    if (regulationId === selectedRegulationId) {
      setSelectedRegulationId(null);
    }
  };
  const handleSend = () => {
    ActionModal.show({
      title: 'Xác nhận gửi phiếu chấm điểm?',
      onAccept: sendDcpReport
    });
  }
  const handleAddStudent = (regulationId: string) => {
    if (selectedClassId === null || regulationId === null || currentStudent === null) {
      return;
    }
    const dcpClassReport = dcpReport.dcpClassReports.find(x => x.classId === selectedClassId);
    if (!dcpClassReport) {
      return;
    }
    const fault = dcpClassReport.faults.find(x => x.regulationId === regulationId);
    if (!fault) {
      return;
    }
    addStudentToFault({
      classId: selectedClassId,
      regulationId: regulationId,
      studentId: currentStudent.id
    });
  };
  const handleRemoveStudent = (regulationId: string, studentId: string) => {
    if (selectedClassId === null || regulationId === null) {
      return;
    }
    const dcpClassReport = dcpReport.dcpClassReports.find(x => x.classId === selectedClassId);
    if (!dcpClassReport) {
      return;
    }
    const fault = dcpClassReport.faults.find(x => x.regulationId === regulationId);
    if (!fault) {
      return;
    }
    removeStudentFromFault({
      classId: selectedClassId,
      regulationId: regulationId,
      studentId: studentId
    });
  };

  const getDcpClassReports = (): DcpReport.CreateUpdateDcpClassReportDto[] => {
    return dcpReport.dcpClassReports;
  };
  const getDcpClassReportItems = (): DcpReport.CreateUpdateDcpClassReportItemDto[] => {
    return dcpReport.dcpClassReports.find(x => x.classId === selectedClassId)?.faults || [];
  };
  const getDcpStudentReports = (regulationId: string): string[] => {
    return dcpReport.dcpClassReports.find(x => 
      x.classId === selectedClassId)?.faults?.find(x => 
        x.regulationId === regulationId)?.relatedStudentIds || [];
  };

  return (
    <div style={{ height: '100%' }}>
      <Grid container className={classes.container}>
        <Grid item xs={4} sm={3} md={2}>
          <Sidebar activeKey={routes.MyDCPReport} />
        </Grid>
        <Grid style={{ height: '100%' }} item container xs={8} sm={9} md={10} direction={'column'}>
          <Header pageName="Chấm điểm nề nếp" />
          <Grid item container direction='column' style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap' }}>
            <Grid item container alignItems='center' justify='space-between' className={classes.actionGroup}>
              <Grid item container direction='row' justify='center' alignItems='center' style={{width: 'auto', marginLeft: 0}}>
                <ScheduleIcon />
                <p style={{marginLeft: 8}}>{formatTime(new Date().toString())}</p>
              </Grid>
              <Button 
                variant={'contained'} 
                color={'primary'}
                endIcon={<SendIcon />}
                onClick={handleSend}
                >
                Gửi phiếu chấm
              </Button>
            </Grid>              
            <Grid item container direction={'row'} style={{ flex: 1, minHeight: 0, flexWrap: 'nowrap', padding: 16, paddingBottom: 0 }}>
              {
                /*
                  add classes section
                */
              }
              <Grid item container direction='column' className={classes.section}>
                <Grid item container direction='row' justify='space-between' alignItems='center' className={classes.filter}>
                  <Autocomplete
                    id='dcpreport-create-class-selector'
                    className={classes.classesSelector}
                    options={classOptions}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) => option.id === value.id}
                    value={currentClass}
                    onChange={(e, newValue) => setCurrentClass(newValue)}
                    size='small'
                    renderInput={(params) => (
                      <TextField {...params} variant='outlined' label='Chọn lớp' placeholder='Nhập tên lớp' />
                    )}
                  />
                  <IconButton 
                    aria-label='add' 
                    disabled={currentClass === null}
                    onClick={handleAddClass}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Grid>
                <Grid item container style={{flex: 1, minHeight: 0, overflowY: 'auto'}}>
                  <Paper elevation={3} style={{width: '100%', minHeight: 0, overflowY: 'auto', height: '100%'}}>
                    <List className={classes.selectedClassList}>
                      {
                        getDcpClassReports().map((el, i) => (
                        <ListItem 
                          key={i} 
                          className={el.classId === selectedClassId ? classes.activeSelectedItem : ''}
                          style={{paddingRight: 8}}
                        >
                          <Grid 
                            container 
                            direction='row' 
                            alignItems='center' 
                            className={classes.selectedItem}
                            onClick={() => setSelectedClassId(el.classId)}
                          >
                            <Grid item container alignItems='center' direction='row'>
                              <GroupIcon color={selectedClassId === el.classId ? 'primary' : 'inherit'} style={{marginLeft: 16, marginRight: 8}} />
                              <p>{classOptions.find(x => x.id === el.classId)?.name}</p>
                            </Grid>
                            <IconButton 
                              aria-label='remove-item' 
                              className={classes.removeItemBtn}
                              onClick={() => handleRemoveClass(el.classId)} 
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                          </Grid>
                        </ListItem>))
                      }
                    </List>
                    {
                      getDcpClassReports().length === 0 && (
                        <Grid container justify='center' alignItems='center' className={classes.emptySelectedList} >
                          <p>Chưa chọn lớp nào</p>
                        </Grid>
                      )
                    }
                  </Paper>
                </Grid>
              </Grid>

              {
                /*
                  add faults section
                */
              }
              <Grid item container direction='column' className={classes.growSection}>
                <Grid item container direction='row' alignItems='center' className={classes.filter}>
                  <Autocomplete
                    id='dcpreport-create-criteria-selector'
                    options={criteriaOptions.sort((x, y) => -x.name.localeCompare(y.name))}
                    value={currentCriteia}
                    onChange={(e, newValue) => setCurrentCriteria(newValue)}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) => option.id === value.id}
                    size='small'
                    className={classes.rulesCatSelector}
                    renderInput={(params) => (
                      <TextField {...params} variant='outlined' label='Tiêu chí' placeholder='Tên tiêu chí' />
                    )}
                  />
                  <Autocomplete
                    id='dcpreport-create-regulation-selector'
                    className={classes.rulesSelector}
                    options={regulationOptions
                      .filter(x => currentCriteia ? currentCriteia.name === x.criteria.name : true )
                      .sort((x, y) => -x.criteria.name.localeCompare(y.criteria.name))}
                    getOptionLabel={(option) => option.name}
                    groupBy={(option) => option.criteria.name}
                    getOptionSelected={(option, value) => option.id === value.id}
                    size='small'
                    value={currentRegulation}
                    onChange={(e, newValue) => setCurrentRegulation(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} variant='outlined' label='Chọn vi phạm' placeholder='Tên vi phạm' />
                    )}
                  />
                  <IconButton 
                    aria-label='add'
                    disabled={selectedClassId === null || currentRegulation === null}
                    onClick={handleAddFault}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Grid>
                <Grid item container style={{flex: 1, minHeight: 0, overflowY: 'auto'}}>
                  <Paper elevation={3} style={{width: '100%', minHeight: 0, overflowY: 'auto'}}>
                    <List className={classes.selectedFaultList}>
                      {
                        getDcpClassReportItems().map((el, i) => (
                        <ListItem 
                          key={i}
                          // className={el.regulationId === selectedRegulationId ? classes.selectedFault : ''}
                        >
                          <Grid 
                            container 
                            direction='column' 
                            alignItems='center' 
                            className={classes.selectedFault}
                          >
                            <Grid item container alignItems='center' direction='row' style={{flex: 1}}>
                              <Grid item container direction='row' style={{flexGrow: 0}}>
                                <CreateIcon fontSize='small' style={{marginRight: 8}}/>
                                <p>{regulationOptions.find(x => x.id === el.regulationId)?.name}</p>
                              </Grid>
                              <Grid item container alignItems='center' direction='row' style={{marginLeft: 'auto', width: 'auto'}}>
                               <IconButton 
                                  aria-label='add-students-item' 
                                  color='primary'
                                  // className={classes.removeItemBtn}
                                  onClick={() => handleAddStudentView(el.regulationId)}
                                  size='small'
                                >
                                  <FaceIcon />
                                </IconButton>
                                <IconButton 
                                  aria-label='remove-item'
                                  color='secondary'
                                  onClick={() => handleRemoveFault(el.regulationId)}
                                  size='small'
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                            <Grid item container direction='row' 
                              style={
                                getDcpStudentReports(el.regulationId).length > 0 
                                || (isAddingStudent && selectedRegulationId === el.regulationId)
                                ? {marginTop: 8} : { display: 'none', marginTop: 8 }
                              }
                            >
                              <FaceIcon fontSize='small' style={{marginRight: 8}} />
                              <p>Học sinh vi phạm</p>
                            </Grid>
                            {
                              /**
                               * select students
                               */
                            }
                           
                            <Grid item container direction='row' 
                              className={classes.studentContainer}
                              style={getDcpStudentReports(el.regulationId).length > 0 ? {marginTop: 8} : {}}
                            >
                              {
                                getDcpStudentReports(el.regulationId).map((studentId, i) => (
                                  <Chip
                                    key={`$student-{i}`}
                                    className={classes.studentChip}
                                    icon={<FaceIcon />}
                                    onDelete={() => handleRemoveStudent(el.regulationId, studentId)}
                                    variant={'outlined'}
                                    color={'primary'}
                                    label={(studentOptions[selectedClassId || ''] || []).find(x => x.id === studentId)?.name}
                                  />
                                ))
                              }
                            </Grid>
                            <Grid item container alignItems='center' 
                              className={classes.studentSection}
                              style={
                                isAddingStudent && selectedRegulationId === el.regulationId 
                                ? {} : { display: 'none' }
                              }
                            >
                              <Autocomplete
                                id='dcpreport-create-student-selector'
                                className={classes.studentSelector}
                                options={
                                  (studentOptions[selectedClassId || ''] || [])
                                  .sort((x, y) => -x.name.localeCompare(y.name))}
                                size='small'
                                getOptionLabel={(option) => option.name}
                                getOptionSelected={(option, value) => option.id === value.id}
                                value={currentStudent}
                                onChange={(e, newValue) => setCurrentStudent(newValue)}
                                renderInput={(params) => (
                                  <TextField {...params} variant='outlined' label='Thêm học sinh vi phạm' placeholder='Học sinh' />
                                )}
                              />
                              <IconButton 
                                aria-label='add' 
                                style={{marginLeft: 8}}
                                size='small'
                                disabled={selectedClassId === null || selectedRegulationId === null || currentStudent === null}
                                onClick={() => handleAddStudent(el.regulationId)}
                              >
                                <AddCircleOutlineIcon />
                              </IconButton>
                              <IconButton 
                                aria-label='add' 
                                style={{marginLeft: 8}}
                                size='small'
                                className={classes.addStudentDoneIcon}
                                onClick={() => setIsAddingStudent(false)}
                              >
                                <DoneIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </ListItem>))
                      }
                    </List>
                    {
                      (getDcpClassReportItems().length === 0) && (
                        <Grid container justify='center' alignItems='center' className={classes.emptySelectedList} >
                          <p>Chọn lớp và thêm vi phạm (nếu có)</p>
                        </Grid>
                      )
                    }
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
};

export default withRedux({
  component: DCPReportCreatePage,
  stateProps: (state: any) => ({
    dcpReport: state.dcpReport,
    sendingDcpReport: state.loading.sendingDcpReport
  }),
  dispatchProps: (dispatch: any) => ({
    addClassToReport: (payload: any) => 
      dispatch(DcpReportActions.addClassToReport(payload)),
    removeClassFromReport: (payload: any) => 
      dispatch(DcpReportActions.removeClassFromReport(payload)),
    addFaultToClass: (payload: any) => 
      dispatch(DcpReportActions.addFaultToClass(payload)),
    removeFaultFromClass: (payload: any) => 
      dispatch(DcpReportActions.removeFaultFromClass(payload)),
    addStudentToFault: (payload: any) => 
      dispatch(DcpReportActions.addStudentToFault(payload)),
    removeStudentFromFault: (payload: any) => 
      dispatch(DcpReportActions.removeStudentFromFault(payload)),
    sendDcpReport: () => 
      dispatch(DcpReportActions.sendDcpReport()),
  })
});