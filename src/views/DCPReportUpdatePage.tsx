/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, FC } from 'react';
import { Grid, Button, TextField, ListItem, Paper, Chip, List, IconButton, Tooltip } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ScheduleIcon from '@material-ui/icons/Schedule';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import GroupIcon from '@material-ui/icons/Group';
import CreateIcon from '@material-ui/icons/Create';
import { Class, Student, Regulation, DcpReport, Util } from '../interfaces';
import { DcpReportsService, RegulationsService, StudentsService, TaskAssignmentService } from '../api';
import { DcpReportActions } from '../store/actions';
import { formatTime } from '../utils/TimeHelper';
import ActionModal from '../components/Modal';
import { taskType } from '../appConsts';
import { useDispatch, useSelector } from 'react-redux';
import { DcpReportSelector, LoadingSelector } from '../store/selectors';
import { toast } from 'react-toastify';
import useStyles from '../assets/jss/views/DCPReportUpdatePage';


interface Props { }

const DCPReportUpdatePage: FC<Props> = () => {
  
  const classes = useStyles();
  const history = useHistory(); 
  const params = useParams<{dcpReportId: string}>();

  const [classOptions, setClassOptions] = useState<Class.ClassForSimpleListDto[]>([]);
  const [criteriaOptions, setCriteriaOptions] = useState<Regulation.CriteriaForSimpleList[]>([]);
  const [regulationOptions, setRegulationsOptions] = useState<Regulation.RegulationForSimpleListDto[]>([]);
  const [studentOptions, setStudentOptions] = useState<Util.IObject<Student.StudentForSimpleListDto[]>>({});

  const [currentClass, setCurrentClass] = useState<Class.ClassForSimpleListDto | null>(null);
  const [currentRegulation, setCurrentRegulation] = useState<Regulation.RegulationForSimpleListDto | null>(null);
  const [currentCriteia, setCurrentCriteria] = useState<Regulation.CriteriaForSimpleList | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Student.StudentForSimpleListDto | null>(null);

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [dcpReportSent, setDcpReportSent] = useState(false);

  const dispatch = useDispatch();
  const dcpReport = useSelector(DcpReportSelector.dcpReport);
  const sendingDcpReport = useSelector(LoadingSelector.sendingDcpReport) ?? false;

  useEffect(() => {
    const initData = async () =>  {
      const { dcpReportId } = params;
      const requestApi: Promise<any>[] = [
        TaskAssignmentService.getAssignedClassesForDcpReport(taskType.DcpReport),
        RegulationsService.getCriteriaForSimpleList(),
        RegulationsService.getRegulationForSimpleList(),
        DcpReportsService.getDcpRerportForUpdate(dcpReportId)
      ];

      const [classesRes, criteriasRes, regulationsRes, dcpReportRes] = await Promise.all(requestApi);

      const classes = classesRes.items as Class.ClassForSimpleListDto[];
      const criterias = criteriasRes.items as Regulation.CriteriaForSimpleList[];
      const regulations = regulationsRes.items as Regulation.RegulationForSimpleListDto[];

      setClassOptions(classes);
      setRegulationsOptions(regulations);
      setCriteriaOptions(criterias);
      const { dcpClassReports } = dcpReportRes as DcpReport.CreateUpdateDcpReportDto || [];
      if (dcpClassReports.length > 0) {
        setSelectedClassId(dcpClassReports[0].classId);
      }
      dispatch(DcpReportActions.initDcpReport(dcpReportRes as DcpReport.CreateUpdateDcpReportDto));
    
      document.title = '2Scool | Cập nhật phiếu chấm điểm nề nếp';
    };

    initData();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
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
    dispatch(DcpReportActions.addClassToReport(currentClass.id));
  };
  const handleRemoveClass = (classId: string) => {
    dispatch(DcpReportActions.removeClassFromReport(classId));
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
    dispatch(DcpReportActions.addFaultToClass({
      classId: selectedClassId,
      regulationId: currentRegulation.id
    }));
  }
  const handleRemoveFault = (regulationId: string) => {
    if (selectedClassId === null) {
      return;
    }
    const dcpClassReport = dcpReport.dcpClassReports.find(x => x.classId === selectedClassId);
    if (!dcpClassReport) {
      return;
    }
    dispatch(DcpReportActions.removeFaultFromClass({
      classId: selectedClassId,
      regulationId: regulationId
    }));
    if (regulationId === selectedRegulationId) {
      setSelectedRegulationId(null);
    }
  };
  const handleSend = () => {
    if (dcpReport.dcpClassReports.length === 0) {
      toast.info("Vui lòng chấm ít nhất 1 lớp!");
      return;
    }
    const { dcpReportId } = params;
    ActionModal.show({
      title: 'Xác nhận cập nhật phiếu chấm điểm?',
      onAccept: () => dispatch(DcpReportActions.updateDcpReport({dcpReportId}))
    });
  };

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
    dispatch(DcpReportActions.addStudentToFault({
      classId: selectedClassId,
      regulationId: regulationId,
      studentId: currentStudent.id
    }));
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
    dispatch(DcpReportActions.removeStudentFromFault({
      classId: selectedClassId,
      regulationId: regulationId,
      studentId: studentId
    }));
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
    <Grid style={{ background: '#fff', flexGrow: 1 }} item container direction={'column'}>
      <Grid item>
        <Header pageName="Cập nhật phiếu chấm điểm nề nếp" hiddenSearchBar />
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
          <Paper variant="outlined" elevation={3} style={{ width: "100%" }}>
            <Grid item container direction='row' alignItems='center' style={{ padding: "5px 0", height: 54 }}>
              <Grid item container alignItems="center" style={{ width: 240, paddingLeft: 32 }}>
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
                    <TextField {...params} variant="outlined" placeholder="Thêm lớp" />
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
              
              <Grid item container alignItems="center" justify="flex-start" style={{ flex: 1 }}>
                <Autocomplete
                  id='dcpreport-create-criteria-selector'
                  options={criteriaOptions.sort((x, y) => -x.name.localeCompare(y.name))}
                  value={currentCriteia}
                  onChange={(e, newValue) => setCurrentCriteria(newValue)}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  size='small'
                  className={classes.rulesCatSelector}
                  style={{ marginLeft: 24 }}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" placeholder="Tiêu chí" />
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
                    <TextField {...params} variant="outlined" placeholder="Thêm vi phạm" />
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
            </Grid>
          </Paper>
        </Grid>

        <Grid item container className={classes.selectedContent} >
          
          {/* classes list */}
          <Paper variant="outlined" elevation={3} square style={{ width: 240, minHeight: 0, overflowY: 'auto', height: '100%'}}>
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
          
          {/* faults list */}
          <Paper variant="outlined" elevation={3} square style={{ flex: 1, marginLeft: 24, minHeight: 0, overflowY: 'auto'}}>
            <List className={classes.selectedFaultList}>
              {
                getDcpClassReportItems().map((el, i) => (
                <ListItem 
                  key={i}
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
                      <Tooltip title="Thêm học sinh vi phạm">
                        <IconButton 
                          aria-label='add-students-item' 
                          color='primary'
                          onClick={() => handleAddStudentView(el.regulationId)}
                          size='small'
                        >
                          <FaceIcon />
                        </IconButton>
                      </Tooltip>
                        
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

        {/* Action button */}
        <Paper variant="outlined" elevation={3} style={{ margin: "16px 24px", marginTop: 0 }}>
          <Grid item container alignItems='center' justify='space-between' className={classes.actionGroup}>
            <Grid item container direction='row' justify='center' alignItems='center' style={{width: 'auto', marginLeft: 0}}>
              <ScheduleIcon />
              <p style={{marginLeft: 8}}>{formatTime(new Date().toString())}</p>
            </Grid>
            <Button 
              variant={'contained'} 
              color={'primary'}
              endIcon={<DoneIcon />}
              onClick={handleSend}
              >
              Cập nhật phiếu chấm
            </Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
};

export default DCPReportUpdatePage;
