import { useEffect, useRef } from 'react'
import { deepCompare } from '../utils/ObjectHelper';

function useDeepCompareMemoize(value: any) {
  const ref = useRef(); 

  if (!deepCompare(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

export function useDeepCompareEffect(callback: () => any, dependencies: Array<any>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    callback,
    dependencies.map(useDeepCompareMemoize)
  );
}