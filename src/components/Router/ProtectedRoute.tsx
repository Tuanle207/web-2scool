import React from 'react';
import { Route, Redirect, RouteComponentProps, useHistory } from 'react-router-dom';
import { Util } from '../../common/interfaces';
import { withRedux } from '../../common/utils/ReduxConnect';

interface OwnProps {
  component: React.FC<RouteComponentProps>;
  policyName?: string;
  path: string; 
  exact?: boolean;
}

type Props = OwnProps & {
  policies: Util.IObject<boolean>
};

const ProtectedRoute: React.FC<Props> = ({
  component: Component,
  policyName = '',
  path,
  policies,
  exact = false, 
  ...rest
}) => {

  console.log({policies});
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

export default withRedux<OwnProps>({
  component: ProtectedRoute,
  stateProps: (state: any) => ({
    policies: state.appConfig?.appConfig?.auth?.grantedPolicies
  })
});