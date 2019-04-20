import Button from '@material-ui/core/Button';
import React from 'react';
import { withAuthorization } from '../Authorization/context';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';

const JoinButton = (props) => {
  const { authUser, history, gameId } = props;

  const handleJoin = (event) => {
    const firestore = props.firebase.db
    event.preventDefault();
    gameId && firestore
      .collection('games')
      .doc(gameId)
      .update({
        players: firebase.firestore.FieldValue.arrayUnion(authUser.username)
      })
      .then(() => {
        firestore
          .collection('games')
          .doc(gameId)
          .collection('doctors')
          .doc(authUser.id)
          .set({
            queue: []
          })
        firestore
          .collection('users')
          .doc(authUser.id)
          .update({
            currentGame: gameId
          })
        authUser.currentGame = gameId;
        history.push(`game?gameId=${gameId}`);
      }).catch(err => {
        console.error(`Error on update of game ${gameId} for player ${authUser.username}: ${err}`);
      });
  }

  return(<Button
    disabled={authUser && (
      !!authUser.currentGame 
      || authUser.role === 'teacher'
    )}
    onClick={event => {
      handleJoin(event)
    }}>
    Join
  </Button>)
}

export default withFirebase(withRouter(withAuthorization(JoinButton)));
