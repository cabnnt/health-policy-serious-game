import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ExitQueueButton from '../ExitQueueButton';
import JoinQueueButton from '../JoinQueueButton';
import Typography from '@material-ui/core/Typography';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
  card: {
    display: 'inline-block',
    margin: 10,
    maxWidth: 375,
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  }
}

class DoctorDisplay extends Component {
  constructor(props) {
    super(props)

    this.doctorListener = null;
    this.state = {
      queue: null,
    }
  }

  componentDidMount() {
    const { gameId, doctor } = this.props;
    const firestore = this.props.firebase.db;

    this.doctorListener = firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctor.id)
      .onSnapshot(doctorDocument => {
        const { queue } = doctorDocument.data();
        this.setState({
          queue: queue,
        });
      })
  }

  componentWillUnmount() {
    this.doctorListener && this.doctorListener();
  }

  render() {
    const { doctor, gameId, authUser, classes, selected, onChangeQueue, onExitQueue } = this.props;
    const { queue } = this.state;

    return(
      authUser
      ? <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Dr. { doctor.username }
            </Typography>
            <Typography component="p">
              Queue length: { queue ? queue.length : 0 }
            </Typography>
            {
              selected
              ? <Typography component="p">
                  You are number <b>
                    { queue.indexOf(authUser.id) + 1 }
                  </b> in the queue, with <b>
                    { queue.length - 1 - queue.indexOf(authUser.id) }
                  </b> patient(s) behind you.
                </Typography>
              : null
            }
          </CardContent>
          <CardActions>
            {
              authUser
                ? authUser.role === 'teacher'
                  ? null
                  : selected
                    ? <ExitQueueButton
                        doctorId={ doctor.id }
                        gameId={ gameId }
                        patientId={ authUser.id }
                        onExitQueue={ onExitQueue }
                      />
                    : <JoinQueueButton
                        doctorId={ doctor.id }
                        gameId={ gameId }
                        patientId={ authUser.id }
                        disabled={ selected }
                        onChangeQueue={ onChangeQueue }
                      />
                : null
            }
          </CardActions>
        </Card>
      : null
    )
  }
}

DoctorDisplay.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctor: PropTypes.object.isRequired,
  onChangeQueue: PropTypes.func.isRequired
}

export default withAuthorization(withFirebase(withStyles(styles)(DoctorDisplay)));
