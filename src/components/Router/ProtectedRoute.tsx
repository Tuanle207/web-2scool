import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect, RouteComponentProps,  } from 'react-router-dom';
import { AppConfigSelector } from '../../store/selectors';

interface IProtectedRouteProps {
  component: React.FC<RouteComponentProps>;
  policyName?: string;
  path: string; 
  exact?: boolean;
}


const ProtectedRoute: FC<IProtectedRouteProps> = ({
  component: Component,
  policyName = '',
  path,
  exact = false, 
  ...rest
}) => {

  const policies = useSelector(AppConfigSelector.grantedPolicies);

  return (
    <Route 
      {...{ path, exact, ...rest }}
      render={props => 
        ((policies && policies[policyName] === true) || policyName === '') ? 
        (<Component {...props} />)
        :
        (<Redirect to={{ pathname: '/errors', state: { from: props.location } }} />)
      }
    />
  );
};

export default ProtectedRoute;