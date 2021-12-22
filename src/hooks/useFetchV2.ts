import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useEffect, useRef, useState } from 'react';
import { useDeepCompareEffect } from '.';
import { Util } from '../interfaces'

type FetchFn<T> =  (...args: any) => Promise<Util.PagingModel<T>>;

interface IUseFetchHookProps<T> {
  pageSize?: number;
  pageIndex?: number;
  filter?: Util.PagingFilter[];
  fetchFn: FetchFn<T>;
} 

export const useFetchV2 = <T = any> ({ fetchFn, filter, pageIndex, pageSize }: IUseFetchHookProps<T>) => {

  const fetchAPIDebounced = useRef<FetchFn<T>>(AwesomeDebouncePromise(fetchFn, 500));

  const [ pagingInfo, setPagingInfo ] = useState<Util.PagingInfo>({ 
    pageIndex: pageIndex || 1, 
    pageSize: pageSize || 15,
    filter: filter || []
  });

  const [ res, setRes ] = useState<Util.PagingModel<T>>({
    items: [],
    pageIndex: 1,
    totalCount: 0,
    pageSize: 0
  });

  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<string>();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const res = await fetchAPIDebounced.current.call(null, pagingInfo);
        setRes(res);
        if (error) setError(undefined);
      } catch (err: any) {
        setError(err?.message || 'Lỗi');
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ pagingInfo ]);

  const setFilter = (...filters: Util.PagingFilter[]) => {
    const keys = filters.map((x) => x.key);
    const newFilter = (pagingInfo.filter || []).filter((x) => !keys.includes(x.key));

    filters.forEach((filter) =>  {
      newFilter.push(filter);
    });
    
    setPagingInfo(prev => ({...prev, filter: newFilter}));
  };

  const setPageIndex = (pageIndex: number) => {
    setPagingInfo(prev => ({...prev, pageIndex}));
  };

  const setPageSize = (pageSize: number) => {
    setPagingInfo(prev => ({...prev, pageIndex: 1, pageSize}));
  };

  const getFilterCount = () => {
    return [...new Set(pagingInfo.filter?.filter((x) => !!x).map((x) => x.key))].length || 0;
  };

  const resetCache = () => {
    setPagingInfo({
      pageIndex: pageIndex || 1, 
      pageSize: pageSize || 15,
      filter: filter || []
    });
  };

  return {
    pagingInfo,
    setPageIndex,
    setPageSize,
    setFilter,
    getFilterCount,
    updateData: setRes,
    data: res,
    resetCache,
    error,
    loading,
  };

};