import React from 'react';
import 'firebase/firestore';
import { firestore } from 'firebase';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

class WaitingRoom extends React.Component {
  constructor(props){
    super(props);
    this.db = firestore();
    this.listener = null;
    this.state = {
      users: [],
      gameExists: true
    };
  }

  componentDidMount() {
    const { gameId } = queryString.parse(this.props.location.search);
    if (gameId) {
      this.listener = firestore()
      .collection('games')
      .doc(gameId)
      .onSnapshot(document => {
        if (document.exists) {
          document.data().players.forEach(
            username => this.addUser(username)
          )
          
        } else {
          this.setState({ gameExists: false })
        }
      });
    } else {
      this.setState({ gameExists: false })
    }
  }

  componentWillUnmount() {
    this.listener && this.listener();
  }

  addUser(username) {
    let { users } = this.state;

    if (!users.includes(username)) {
      this.setState({
        users: users.concat(username)
      })
    }
  }

  render() {
    const { users, gameExists } = this.state;
    const { gameId } = queryString.parse(this.props.location.search);
    return (
      gameExists
      ? this.listener && _.isEmpty(users)
          ? <p>{ `No users have joined game with ID '${gameId}'` }</p>
          : !users.length
              ? <p>Loading users for this game...</p>
              : <div>
                  <ul>
                    <h2>Users</h2>
                    {
                      users
                        .sort()
                        .map((username, index) => <li key={`user-${index}`}>{username}</li>)
                    }
                  </ul>
                </div>
      : gameId
        ? <p>{ `No game found with game ID ${gameId}.` }</p>
        : <p>No game ID was provided.</p> 
    )
  }
};

export default withRouter(WaitingRoom);
