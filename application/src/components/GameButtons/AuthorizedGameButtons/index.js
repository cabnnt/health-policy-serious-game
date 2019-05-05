import JoinGameButton from '../JoinGameButton';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import StartGameButton from '../StartGameButton';
import ViewGameButton from '../ViewGameButton';
import { withFirebase } from '../../Firebase';
import { withAuthorization } from '../../Authorization/context';

const containerStyle = {
  margin: 5,
  display: 'inline-block',
  float: 'right',
}

class AuthorizedGameButtons extends Component {
  constructor(props) {
    super(props);
    this.state = { startTime: null };
    this.gameListener = null;
  }

  componentDidMount() {
    const { gameId } = this.props;
    const firestore = this.props.firebase.db;
    
    if (gameId) {
      this.gameListener = firestore
        .collection('games')
        .doc(gameId)
        .onSnapshot(gameDocument => {
          if (gameDocument && gameDocument.exists) {
            const { startTime } = gameDocument.data();
            this.setState({ startTime });
          }
        });
    } else {
      console.error(`Expected a gameId string, got ${gameId} instead`)
    }
  }

  componentWillUnmount() {
    this.gameListener && this.gameListener();
  }

  render() {
    const { authUser, gameId } = this.props;
    const currentGame = authUser && authUser.currentGame;
    const { startTime } = this.state;
    const isTeacher = authUser && authUser.role === 'teacher';
    const isStarted = !!startTime;
    const isCurrentGame = currentGame === gameId;
    
    return(
      isTeacher
      ? <div style={ containerStyle }>
          {
            isStarted
            ? <ViewGameButton gameId={ gameId } />
            : <StartGameButton gameId={ gameId } />
          }
        </div>
      : <div style={ containerStyle }>
          <JoinGameButton
            disabled={ !isStarted || isCurrentGame }
            gameId={ gameId }
          />
        </div>
    )
  }
}

AuthorizedGameButtons.propTypes = {
  gameId: PropTypes.string.isRequired,
};

export default withAuthorization(withFirebase(AuthorizedGameButtons));
