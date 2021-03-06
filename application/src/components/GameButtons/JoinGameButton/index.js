import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { withAuthorization } from '../../Authorization/context';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
import firebase from 'firebase';

const JoinGameButton = (props) => {
  const { authUser, history, gameId, disabled } = props;

  const handleJoin = async (event) => {
    const firestore = props.firebase.db;
    const game = firestore.collection('games').doc(gameId);
    const gameDocument = gameId ? await game.get() : null;
    
    if (gameDocument && gameDocument.exists) {
      const gameData = gameDocument.data();
      const players = gameData.players;
      const numberOfDoctors = parseInt(gameData.numberOfDoctors);
      const numberOfPlayers = players ? players.length : 0;
      game
        .update({
          players: firebase.firestore.FieldValue.arrayUnion(authUser.username)
        })
        .then(() => {
          if (numberOfPlayers < numberOfDoctors) {
            game
              .collection('doctors')
              .doc(authUser.id)
              .set({
                id: authUser.id,
                username: authUser.username,
                queue: []
              })
          }
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
  }
  
  return(
    <Button
      disabled={ disabled }
      onClick={
        event => {
          handleJoin(event)
        }
      }
    >
      Join
    </Button>
  );
}

JoinGameButton.propTypes = {
  gameId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default withFirebase(withRouter(withAuthorization(JoinGameButton)));
