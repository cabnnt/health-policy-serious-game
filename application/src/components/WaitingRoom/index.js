import React from 'react';
import 'firebase/firestore';
import { firestore } from 'firebase';
//import Image from '../WaitingRoom/test.jpg';
import color from '@material-ui/core/colors/deepOrange';
import { withAuthorization } from '../Authorization/context';
import WaitingRoomStyles from '../../styles/waitingRoomStyles';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = WaitingRoomStyles;


class WaitingRoom extends React.Component {

  constructor(props){
    super(props);
    this.db = firestore();
    this.listener = null;
    this.state = { users: [] };
  }

  componentDidMount() {
    this.listener = firestore()
      .collection('users')
      .onSnapshot(collection => {
        collection.forEach(
          document => this.addUser(document.get('username'))
        )
      });
  }

  componentWillUnmount() {
    this.listener();
  }

  addUser(username) {
    let { users } = this.state;

    if (!users.includes(username)) {
      this.setState({
        users: users.concat(username)
      })
    }
  }

  render(){
    let { users } = this.state;
    const { classes } = this.props;

    return <div className={classes.lobbyBackground}>
      <div className={classes.usersDiv}>
      <ul>
        <h2>Waiting Room</h2>
        {
          users
            .sort()
            .map((username, index) => <li key={`user-${index}`}>{username}{index}</li>)
        }

      </ul>
      </div>
    </div>
  
  }
  
};

export default withAuthorization(withStyles(styles)(WaitingRoom));
