import app, {
  firestore
} from 'firebase';
import 'firebase/auth';

import React, { Component } from 'react';
import QueueStyles from '../../styles/queueStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { withAuthorization } from '../Authorization/context';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

library.add(faUser)


const styles = QueueStyles;

class Queue extends Component {

	constructor(props) {
		super(props);
	}

  render() {

  	const { classes, authUser } = this.props;
  	console.log(authUser.username);

    return(
    	<div>
    		<h3 className={ classes.patientQueue }><FontAwesomeIcon icon="user" />{authUser.username}</h3>
    	</div>
    	)

  }
}

export default withAuthorization(withStyles(styles)(Queue));