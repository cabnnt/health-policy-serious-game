import React, { Component } from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import Home from '../Home';
import Account from '../Account';
import SignUp from '../SignUp';
import Navigation from '../Navigation';
import { withFirebase } from '../Firebase';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null
    };
  }

  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      }
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return(
      <Router>
        <div>
          <Navigation authUser = { this.state.authUser } />
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);
