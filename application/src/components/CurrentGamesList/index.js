import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import { Paper } from '@material-ui/core';
import SimpleTable from '../SimpleTable';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

class CurrentGamesList extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, games: [] };
    this.currentGamesListener = null;
  }

  componentDidMount() {
    const { firebase } = this.props;
    const firestore = firebase.db;
    const since = moment().startOf('day').toDate();
    
    this.currentGamesListener = firestore
      .collection('games')
      .where('createdAt', '>=', since)
      .orderBy('createdAt', 'desc')
      .onSnapshot(collection => {
        collection.forEach(
          document => this.addGame(document)
        )

        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.currentGamesListener && this.currentGamesListener();
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
    const { games, loading } = this.state;

    return (
      <Paper style={{ margin: 10 }}>
        {
          !loading
            ? games.length === 0
              ? <Typography style={{ margin: 5 }} variant='body2'>No current games found.</Typography>
              : <SimpleTable
                  collection={ games }
                  attributes={ ['name'] }
                  headers={
                    { name: 'Current games'}
                  }
                />
            : <Typography style={{ margin: 5 }} variant='body2'>Loading games...</Typography>
        }
      </Paper>
    );
  }
}

export default withFirebase(withAuthorization(CurrentGamesList));
