import { useSelector } from 'react-redux';
import { AppConfigSelector } from '../store/selectors';

export function usePermissionChecker(policyName: string) {

  const grantedPolicies = useSelector(AppConfigSelector.grantedPolicies);
  
  return grantedPolicies[policyName] === true;
};