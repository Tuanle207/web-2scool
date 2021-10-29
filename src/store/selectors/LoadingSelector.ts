import { createSelector } from 'reselect';
import { IState } from '../reducers';

const Loading = (state: IState) => state.loading;

const fetchingAppConfig = createSelector(Loading, loading => loading.fetchingAppConfig)

export const LoadingSelector = {
  fetchingAppConfig
};