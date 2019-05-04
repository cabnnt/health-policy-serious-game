import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { withAuthorization } from '../../Authorization/context';
import { withFirebase } from '../../Firebase';
import { withRouter } from 'react-router-dom';

const ViewGameButton = (props) => {
  const { authUser, history, gameId } = props;

  const handleViewGame = async (event) => {
    const firestore = props.firebase.db;
    const game = firestore.collection('games').doc(gameId);
    const gameDocument = gameId ? await game.get() : null;

    console.log(gameDocument);

    if (gameDocument && gameDocument.exists) {
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
    }
  }

  return(
    <Button onClick={ handleViewGame }>
      View
    </Button>
  )
}

ViewGameButton.propTypes = {
  gameId: PropTypes.string.isRequired,
};

export default withFirebase(withRouter(withAuthorization(ViewGameButton)));
