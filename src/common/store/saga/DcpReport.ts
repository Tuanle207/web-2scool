import { all, call, put, takeLatest } from '@redux-saga/core/effects';
import { toast } from 'react-toastify';
import { webStore as store } from '..';
import { DcpReportsService } from '../../api';
import { DcpReportActions, LoadingActions } from '../actions';

function* createDcpReport() {
  try {

    yield put(LoadingActions.sendingDcpReport(true));

    const dcpReport = store.store.getState().dcpReport;
   
    yield call(DcpReportsService.createDcpReport, dcpReport);
    
    yield put(DcpReportActions.resetDcpReport());

    toast('Gửi phiếu chấm điểm thành công', {
      type: 'success'
    });

  } catch (err) {
    toast('Không thể gửi phiếu chấm điểm. Đã có lỗi xảy ra!', {
      type: 'error'
    });
    console.log('ERROR', err)
  } finally {
    yield put(LoadingActions.sendingDcpReport(false));
  }
} 

function* updateDcpReport({payload}: {payload: {dcpReportId: string}}) {
  try {
    yield put(LoadingActions.sendingDcpReport(true));

    const dcpReport = store.store.getState().dcpReport;
   
    yield call(DcpReportsService.updateDcpReport, payload.dcpReportId, dcpReport);
    
    yield put(DcpReportActions.resetDcpReport());

    toast('Cập nhật phiếu chấm điểm thành công', {
      type: 'success'
    });

  } catch (err) {
    toast('Không thể cập nhật phiếu chấm điểm. Đã có lỗi xảy ra!', {
      type: 'error'
    });
    console.log('ERROR', err)
  } finally {
    yield put(LoadingActions.sendingDcpReport(false));
  }
} 

export default function* () {
  yield all([
    takeLatest(DcpReportActions.sendDcpReport, createDcpReport),
    takeLatest(DcpReportActions.updateDcpReport, updateDcpReport)
  ]);
}