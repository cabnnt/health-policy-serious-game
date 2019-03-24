import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import Landing from '../Landing';
import SignOutButton from '../SignOut';

const Navigation = ({ authUser }) => (
  <div>{ authUser ? <AuthorizedNavigation /> : <UnauthorizedNavigation /> }</div>
);

const AuthorizedNavigation = () => (
  <ul>
    <li>
      <Link to={ ROUTES.HOME }>Home</Link>
    </li>
    <li>
      <Link to={ ROUTES.ACCOUNT }>Account</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const UnauthorizedNavigation = () => (
  <Landing />
);

export default Navigation;
