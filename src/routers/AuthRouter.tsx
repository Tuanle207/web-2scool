import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Login from '../views/Login';

interface Props {
  isAuth?: boolean;
}

const AuthRouter: React.FC<Props> = () => {
  return (
    <Router>
      <Switch>
        <Route 
          path='/login' 
          exact 
          component={Login} />
        <Redirect to='/login' />
      </Switch>
    </Router>
  );
};

export default AuthRouter;