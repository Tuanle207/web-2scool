import { createSelector } from 'reselect';
import { IState } from '../reducers';

const DcpReport = (state: IState) => state.dcpReport;

const dcpReport = createSelector(DcpReport, dcpReport => dcpReport);

export const DcpReportSelector = {
  dcpReport
};