import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { signIn } from '../utils/constants';

const ProtectedRoute = ({ component: Component, ...props }) => (
  <Route>
    {props.loggedIn ? <Component {...props} /> : <Redirect to={signIn} />}
  </Route>
);

export default ProtectedRoute;
