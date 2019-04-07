import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import moment from 'moment';

class CurrentGamesList extends Component {
  constructor(props) {
    super(props);
    this.state = { games: [] };
    this.currentGamesListener = null;
  }

  async componentDidMount() {
    const { firebase } = this.props;
    const firestore = firebase.db;
    const since = moment().startOf('day').toDate();
    
    this.currentGamesListener = await firestore
      .collection('games')
      .where('created_at', '>=', since)
      .orderBy('created_at', 'desc')
      .onSnapshot(collection => {
        collection.forEach(
          document => this.addGame(document)
        )
      });
  }

  componentWillUnmount() {
    this.currentGamesListener();
  }

  addGame = gameRecord => {
    const { games } = this.state;
    const game = { id: gameRecord.id, ...gameRecord.data() };
    
    if (!games.includes(game)) {
      this.setState({ games: [ ...games].concat(game) })
    }
  }

  render() {
    const { games } = this.state;

    return (
      this.currentGamesListener && !games.length
        ? 'No current games found.'
        : <ul>
            {
              !games.length
                ? 'Loading games...'
                : games
                    .map(({ id }, index) => <li key={`game-${index}`}>{id}</li>)
            }
          </ul>
    );
  }
}

export default withFirebase(withAuthorization(CurrentGamesList));
