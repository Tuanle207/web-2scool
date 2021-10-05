import { createSelector } from 'reselect';

const Loading = (state: any) => state.loading;

const createFetchingAppConfigSelector = () => createSelector(Loading, loading => loading.fetchingAppConfig)

export default {
  createFetchingAppConfigSelector
};