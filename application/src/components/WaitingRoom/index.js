import React from 'react';
import 'firebase/firestore';
import { firestore } from 'firebase';

const INITIAL_STATE = { users: [] };

export default class WaitingRoom extends React.Component {
  constructor(props){
    super(props);
    this.db = firestore();
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    firestore().collection('users').get()
      .then(
        collection => {
          collection.forEach(
            document => this.addUser(document.get('username'))
          )
        }
      );
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
