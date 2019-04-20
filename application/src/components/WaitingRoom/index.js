import React from 'react';
import 'firebase/firestore';
import { firestore } from 'firebase';
import color from '@material-ui/core/colors/deepOrange';
import { withAuthorization } from '../Authorization/context';
import WaitingRoomStyles from '../../styles/waitingRoomStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

const styles = WaitingRoomStyles;


class WaitingRoom extends React.Component {
  constructor(props){
    super(props);
    this.db = firestore();
    this.listener = null;
    this.state = { users: [] };
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
        }
      });
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
    let { users } = this.state;
    const { classes } = this.props;
    const { gameId } = queryString.parse(this.props.location.search);
    const test = {
      color: 'red',
      fontSize: '20px'
    };
    return ( 
      this.listener && _.isEmpty(users)
        ? `No users have joined game with ID '${gameId}'`
        : (
          !users.length
            ? <div><p>Loading users for this game...</p></div>
            : <div className={test}>
                <ul>
                  <h2 >Users</h2>
                  {
                    users
                      .sort()
                      .map((username, index) => <li key={`user-${index}`}>{username}</li>)
                  }
                </ul>
              </div>
        )
    )
  }
  
};
const style = withAuthorization(withStyles(styles)(WaitingRoom));
export default withRouter(WaitingRoom);
