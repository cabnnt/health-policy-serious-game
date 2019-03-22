import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

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
          <Navigation authUser = { this.state.authUser }/>
          
          <hr/>
        </div>
      </Router>
    );
  }
}

export default withFirebase(App);
