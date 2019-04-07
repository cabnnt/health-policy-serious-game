import app, {
  firestore
} from 'firebase';
import 'firebase/auth';

import React, { Component } from 'react';
import QueueStyles from '../../styles/queueStyles';
import withStyles from '@material-ui/core/styles/withStyles';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

library.add(faUser)


const styles = QueueStyles;

class Queue extends Component {
	constructor(props) {
  	super(props);
  	this.auth = app.auth();
  	
	}


  render() {
  	const { classes } = this.props;
    return(
    	<div>
    		<h3 className={ classes.patientQueue }><FontAwesomeIcon icon="user" /> Patient 1</h3>
    	</div>
    	)

  }
}

export default withStyles(styles)(Queue)