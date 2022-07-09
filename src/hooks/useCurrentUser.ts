import { useSelector } from 'react-redux';
import { AppConfigSelector } from '../store/selectors';


export function useCurrentUser() {
  const currentUser = useSelector(AppConfigSelector.currentUser);

  return { currentUser };
}

export function useCurrentAccount() {
  const currentAccount = useSelector(AppConfigSelector.currentAccount);

  return { currentAccount };
}