import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import SimpleTable from '../SimpleTable';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

class CurrentGamesList extends Component {
  constructor(props) {
    super(props);
    this.state = { games: [] };
    this.currentGamesListener = null;
  }

  componentDidMount() {
    const { firebase } = this.props;
    const firestore = firebase.db;
    const since = moment().startOf('day').toDate();
    
    this.currentGamesListener = firestore
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
    const gameIds = games.map(game => game.id);
    
    if (!gameIds.includes(game.id)) {
      this.setState({ games: games.concat(game) })
    }
  }

  render() {
    const { games } = this.state;

    return (
      <div>
        <Typography style={ { margin: '10px' } } variant='h5'>Current games</Typography>
        {
          this.currentGamesListener && !games.length
            ? 'No current games found.'
            : (
              !games.length
                ? 'Loading games...'
                : <SimpleTable
                    collection={ games }
                    attributes={ ['id'] }
                    headers={
                      { id: 'ID' }
                    } />
            )
        }
      </div>
    );
  }
}

export default withFirebase(withAuthorization(CurrentGamesList));
