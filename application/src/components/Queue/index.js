import app, {
  firestore
} from 'firebase';
import 'firebase/auth';

import React, { Component } from 'react';
import QueueStyles from '../../styles/queueStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { withAuthorization } from '../Authorization/context';
import queryString from 'query-string';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

library.add(faUser)

const styles = QueueStyles;

class Queue extends Component {
	constructor(props) {
		super(props);
		this.listener = null;
	}

	// componentDidMount() {
	// 	const { gameId } = queryString.parse(this.props.location.search);
	// 	if (gameId) {
	// 		this.listener = firestore()
	// 			.collection('games')
	// 			.doc(gameId)
	// 			.onSnapshot(gameDocument => {
	// 				if (gameDocument.exists) {
	// 					gameDocument.data().queues
	// 				}
	// 			})
	// 	}
	// }

	handleClickExitQueue = event => {
    if(window.confirm("Are you sure you want to exit the queue?")) {
      const { name } = this.props;
		 	this.props.onClickExitQueue(name);
      this.setState(state => ({
      open: !state.open,
      }));
    }
	};
	
  render() {
  	const { classes, authUser } = this.props;
		console.log(authUser.username);
    return(
    	<div>
				<h3>x patients ahead of you</h3> 
    		<h3 className={ classes.patientQueue }><FontAwesomeIcon icon="user" />{authUser.username}</h3>
				<h3>x patients behind you</h3>
				<button onClick={this.handleClickExitQueue}>Return to Waiting Room</button>
    	</div>
			)
	}
}

export default withAuthorization(withStyles(styles)(Queue));