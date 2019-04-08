import React from 'react';

const AuthorizationContext = React.createContext(null);

export const withAuthorization = Component => props => (
  <AuthorizationContext.Consumer>
    { authUser => <Component { ...props } authUser={ authUser } /> }
  </AuthorizationContext.Consumer>
);

export default AuthorizationContext;
