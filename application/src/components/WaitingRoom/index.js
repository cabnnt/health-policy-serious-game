import React from 'react';
import 'firebase/firestore';
import { firestore } from 'firebase';

export default class WaitingRoom extends React.Component {
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
    this.setState({
      users: this.state.users.concat(username)
    })
  }

  render(){
    return <div>
      <ul>
        <h2>Users</h2>
        {
          this.state.users.map((username, index) => <li key={`user-${index}`}>{username}</li>)
        }
      </ul>
    </div>
  }
};
