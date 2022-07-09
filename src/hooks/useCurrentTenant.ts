import { useSelector } from 'react-redux';
import { AppConfigSelector } from '../store/selectors';


export function useCurrentTenant() {
  const currentTenant = useSelector(AppConfigSelector.currentTenant);

  return { currentTenant };
}