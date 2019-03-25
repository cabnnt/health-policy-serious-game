import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = { signingOut: false }

class SignOutButtonBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate() {
    if (this.state.signingOut) {
      this.setState({ ...INITIAL_STATE });
    }
  }

  signOut = event => {
    event.preventDefault();

    this.props.firebase.signOut();
    this.setState({ signingOut: true });
  }

  render() {
    return(
      this.state.signingOut
        ? <Redirect to={ ROUTES.LANDING } />
        : <button type="button" onClick={ this.signOut }>
            Sign out
          </button>
    );
  }
}

const SignOutButton = withFirebase(SignOutButtonBase);

export default SignOutButton;
