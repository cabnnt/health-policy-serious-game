import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import React from 'react';
import { withAuthorization } from '../../Authorization/context';
import { withFirebase } from '../../Firebase';
import { withRouter } from 'react-router-dom';

const StartGameButton = (props) => {
  const { authUser, history, gameId } = props;
  
  const handleStartGame = async (event) => {
    const firestore = props.firebase.db;

    firestore
      .collection('games')
      .doc(gameId)
      .update({
        startTime: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        firestore
          .collection('users')
          .doc(authUser.id)
          .update({
            currentGame: gameId
          })
          .then(() => {
            authUser.currentGame = gameId;
            history.push(`game?gameId=${gameId}`);
          });
      });
  }

  return(
    <Button onClick={ handleStartGame }>
      Start
    </Button>
  )
}

StartGameButton.propTypes = {
  gameId: PropTypes.string.isRequired,
};

export default withFirebase(withRouter(withAuthorization(StartGameButton)));
