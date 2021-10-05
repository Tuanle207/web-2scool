import { createAction } from '@reduxjs/toolkit';
import { DcpReport } from '../../interfaces';

const addClassToReport = createAction( 
  'app/DcpReportActions/addClassToReport', 
  (payload: string) => ({payload}) 
);

const removeClassFromReport = createAction( 
  'app/DcpReportActions/removeClassFromReport', 
  (payload: string) => ({payload})
);

const addFaultToClass = createAction( 
  'app/DcpReportActions/addFaultToClass', 
  (payload: {
    classId: string;
    regulationId: string;
  }) => ({payload})
);

const removeFaultFromClass = createAction( 
  'app/DcpReportActions/removeFaultFromClass', 
  (payload: {
    classId: string;
    regulationId: string;
  }) => ({payload})
);

const addStudentToFault = createAction( 
  'app/DcpReportActions/addStudentToFault',
  (payload: {
    classId: string;
    regulationId: string;
    studentId: string;
  }) => ({payload})
);

const removeStudentFromFault = createAction( 
  'app/DcpReportActions/removeStudentFromFault',
  (payload: {
    classId: string;
    regulationId: string;
    studentId: string;
  }) => ({payload})
);

const initDcpReport = createAction(
  'app/DcpReportActions/sendDcpReport/initDcpReport',
  (payload: DcpReport.CreateUpdateDcpReportDto) => ({payload})
);

const sendDcpReport = createAction( 
  'app/DcpReportActions/sendDcpReport'
);

const updateDcpReport = createAction( 
  'app/DcpReportActions/updateDcpReport',
  (payload: {dcpReportId: string}) => ({payload})
);

const resetDcpReport = createAction( 
  'app/DcpReportActions/resetDcpReport'
);

export default {
  addClassToReport,
  removeClassFromReport,
  addFaultToClass,
  removeFaultFromClass,
  addStudentToFault,
  removeStudentFromFault,
  sendDcpReport,
  resetDcpReport,
  updateDcpReport,
  initDcpReport
};
