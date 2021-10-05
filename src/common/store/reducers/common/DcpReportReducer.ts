import { createReducer } from '@reduxjs/toolkit';
import { DcpReport, Util } from '../../../interfaces';
import { DcpReportActions } from '../../actions';

const initialState: DcpReport.CreateUpdateDcpReportDto = {
  dcpClassReports: []
};

export default createReducer(initialState, build => {
  build
    .addCase(
      DcpReportActions.addClassToReport, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        if (state.dcpClassReports.findIndex(el => el.classId === action.payload) === -1)
        state.dcpClassReports.push({
          classId: action.payload,
          faults: []
        });
      }
    )
    .addCase(
      DcpReportActions.removeClassFromReport, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        const index = state.dcpClassReports.findIndex(el => el.classId === action.payload);
        state.dcpClassReports.splice(index, 1);
      }
    )
    .addCase(
      DcpReportActions.addFaultToClass, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        const classReport = state.dcpClassReports.find(el => el.classId === action.payload.classId);
        if (classReport && classReport.faults.findIndex(el => el.regulationId === action.payload.regulationId) === -1) {
          classReport.faults.push({
            regulationId: action.payload.regulationId,
            relatedStudentIds: []
          })
        }
      }
    )
    .addCase(
      DcpReportActions.removeFaultFromClass, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        console.log('can you hear me');
        
        const classReport = state.dcpClassReports.find(el => el.classId === action.payload.classId);
        if (classReport) {
          const index = classReport.faults.findIndex(el => el.regulationId === action.payload.regulationId);
          if (index !== -1) {
            classReport.faults.splice(index, 1);
          }
        }
      }
    )
    .addCase(
      DcpReportActions.addStudentToFault, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        const classReport = state.dcpClassReports.find(el => el.classId === action.payload.classId);
        if (classReport) {
          const fault = classReport.faults.find(el => el.regulationId === action.payload.regulationId);
          if (fault && fault.relatedStudentIds.findIndex(el => el === action.payload.studentId) === -1) {
            fault.relatedStudentIds.push(action.payload.studentId);
          }
        }
      }
    )
    .addCase(
      DcpReportActions.removeStudentFromFault, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        const classReport = state.dcpClassReports.find(el => el.classId === action.payload.classId);
        if (classReport) {
          const fault = classReport.faults.find(el => el.regulationId === action.payload.regulationId);
          if (fault) {
            const index = fault.relatedStudentIds.findIndex(el => el === action.payload.studentId);
            index !== -1 && fault.relatedStudentIds.splice(index, 1);
          }
        }
      }
    )
    .addCase(
      DcpReportActions.initDcpReport, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        return action.payload;
      }
    )
    .addCase(
      DcpReportActions.resetDcpReport, 
      (state: DcpReport.CreateUpdateDcpReportDto, action: Util.BaseAction) => {
        return initialState;
      }
    );
})