import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import Home from '../Home';
import Landing from '../Landing';
import SignUp from '../SignUp';
import Navigation from '../Navigation';
import AuthorizationContext, { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import SignOutButton from '../SignOut';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null
    };
  }

  async componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        let email = authUser ? authUser.email : null;
        let user = this.props.firebase.fetchUserFromFirestore(email);
        authUser
          ? this.setState({ authUser: user })
          : this.setState({ authUser: null });
      }
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { authUser } = this.state;

    return(
      <AuthorizationContext.Provider value={ authUser }>
        <Router>
          { authUser ? <Navigation /> : null }
          <div>
            <Route
              exact
              path={ ROUTES.LANDING }
              render={
                () => authUser
                  ? <Home />
                  : <Landing /> } />
            <Route path={ ROUTES.HOME } component={ Home } />
            <Route path={ ROUTES.SIGN_IN } component={ Landing } />
            <Route path={ ROUTES.SIGN_UP } component={ SignUp } />
            <Route path='/signout' component={ SignOutButton } />
          </div>
        </Router>
      </AuthorizationContext.Provider>
    );
  }
}

export default withFirebase(withAuthorization(App));
