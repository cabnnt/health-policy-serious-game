import React, { Component } from 'react';
import { Link , Route} from 'react-router-dom'
import Lobby from '../Lobby'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { withAuthorization } from '../Authorization/context';
import * as ROUTES from '../../constants/routes';
import _ from 'lodash';
import firebase from 'firebase';
const styles = theme => ({
  root: {
    width: '90%',
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class SimpleTable extends Component {
  constructor(props) {
    super(props);
  }

  handleJoin(event, gameId){
    // console.log(event);
    console.log(this.props.collection);
    for(let i=0; i<this.props.collection.length; i++){
      if(gameId == this.props.collection[i].name){
        gameId = this.props.collection[i].id
      }
    }
    const { authUser, history } = this.props;
    const firestore = this.props.firebase.db
    event.preventDefault();
    let players = null;
    let reference = firestore
      .collection('games')
      .doc(gameId)
      .update({
        players: firebase.firestore.FieldValue.arrayUnion(authUser.username)
      })
      .then(response => {
        firestore
          .collection('users')
          .doc(authUser.id)
          .update({
            currentGame: gameId
          })
        authUser.currentGame = gameId;
        history.push(`game?gameId=${gameId}`);
      }).catch(err => {
        console.error(`Error on update of game ${gameId} for player ${authUser.username}: ${err}`);
      });
  }

  render() {
    const { classes, collection, attributes, headers } = this.props;
    // console.log(this.props);
    return(
      <Paper className={ classes.root }>
        <Table className={ classes.table }>
          <TableHead>
            <TableRow>
              { 
                attributes.map((attribute, index) => {
                  return (
                    index === 0
                      ? <TableCell key={ `${attribute}-header` }>{ headers[attribute] }</TableCell>
                      : <TableCell align='right'>{ headers[attribute] }</TableCell>
                  );
                })
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              collection.map(row => (
                <TableRow key={ row.id }>
                  {
                    attributes.map((attribute, index) => {
                      return (
                        index === 0
                          ? <TableCell
                              key={ row[attribute] }
                              component='th'
                              scope='row'>
                              { row[attribute] }
                              <Button onClick={(event) => this.handleJoin(event, row[attribute])}>
                                Join
                              </Button>
                            </TableCell>
                          : <TableCell>{ row[attribute] }</TableCell>
                      );
                    })
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }

}

export default withAuthorization(withFirebase(withRouter(withStyles(styles)(SimpleTable))));
