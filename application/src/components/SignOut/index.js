import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButtonBase = ({ firebase }) => (
  <button type='button' onClick={firebase.signOut}>
    Sign out
  </button>
);

const SignOutButton = withFirebase(SignOutButtonBase);

export default SignOutButton;
