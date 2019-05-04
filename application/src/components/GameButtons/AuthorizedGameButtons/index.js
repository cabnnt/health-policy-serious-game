import Button from '@material-ui/core/Button';
import JoinGameButton from '../JoinGameButton';
import PropTypes from 'prop-types';
import React from 'react';
import StartGameButton from '../StartGameButton';
import ViewGameButton from '../ViewGameButton';
import { withAuthorization } from '../../Authorization/context';

const AuthorizedGameButtons = (props) => {
  const { authUser, gameId } = props;
  const isTeacher = authUser && authUser.role === 'teacher';
  const containerStyle = {
    margin: 5,
    display: 'inline-block',
    float: 'right',
  }

  return(
    isTeacher
    ? <div style={ containerStyle }>
        <ViewGameButton gameId={ gameId } />
        <StartGameButton />
      </div>
    : <div style={ containerStyle }>
        <JoinGameButton />
      </div>
  )
}

AuthorizedGameButtons.propTypes = {
  gameId: PropTypes.string.isRequired,
};

export default withAuthorization(AuthorizedGameButtons);
