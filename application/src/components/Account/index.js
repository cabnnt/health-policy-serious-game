import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';

const styles = {
  card: {
    display: 'inline-block',
    margin: 10,
    maxWidth: 375,
    minWidth: 275,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  pos: {
    marginBottom: 12,
  }
}

class Account extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const { classes, authUser } = this.props;
    
   return(
     authUser
      ?
     
      <Card>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Welcome, {authUser.username}!
        </Typography>
        
        <Typography component="p">
          Your role is {authUser.role=='teacher' ? 'administrator' : authUser.role}.
        </Typography>
        <Typography component="p">
          Account email: {authUser.email}
          
        </Typography>
       
        
       
      </CardContent>
      <Button>Change Password</Button>
      </Card>

    
    
    : null
    );
    
  }
}
export default withAuthorization(withFirebase(withStyles(styles)(Account)));