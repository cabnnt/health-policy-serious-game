import React, { Component } from 'react';
import DoctorDisplay from '../DoctorDisplay';
import Paper from '@material-ui/core/Paper';
import queryString from 'query-string';
import { withAuthorization } from '../Authorization/context';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/core/styles';
import firebase from 'firebase';

const styles = {
  main: {
    margin: 10
  }
}

class DoctorDisplayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      currentQueueDoctorId: null,
      gameId: queryString.parse(this.props.location.search).gameId
    }
    this.firestore = this.props.firebase.db;
  }

  componentDidMount() {
    const { gameId } = this.state;
    
    this.firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .onSnapshot(doctorsCollection => {
        doctorsCollection.forEach(doctorDocument => {
          this.addDoctor({ id: doctorDocument.id, ...doctorDocument.data() })
        });
      });
  }

  onChangeQueue(gameId, doctorId, patientId) {
    const { authUser } = this.props;
    const { currentQueueDoctorId } = this.state;

    if (currentQueueDoctorId) {
      this.leaveQueue(gameId, currentQueueDoctorId, patientId);
    }
    this.joinQueue(gameId, doctorId, patientId);
    
    authUser.currentQueue = doctorId;
    
    this.setState({ currentQueueDoctorId: doctorId });
  }

  joinQueue(gameId, doctorId, patientId) {
    this.firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctorId)
      .update({
        queue: firebase.firestore.FieldValue.arrayUnion(patientId)
      });
  }

  leaveQueue(gameId, doctorId, patientId) {
    const { authUser } = this.props;

    this.firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctorId)
      .update({
        queue: firebase.firestore.FieldValue.arrayRemove(patientId)
      })
      .then(() => {
        authUser.currentQueue = null;
        this.setState({ currentQueueDoctorId: null });
      });
  }

  addDoctor(doctor) {
    const { doctors } = this.state;
    const unique = doctors.filter(d => d.id === doctor.id).length === 0;
    if (unique) {
      this.setState({
        doctors: doctors.concat(doctor)
      })
    }
  }

  render() {
    const { gameId, doctors, currentQueueDoctorId } = this.state;
    const { authUser, classes } = this.props;
    const patientId = authUser ? authUser.id : null;
    return (
      authUser
      ? <Paper className={ classes.main }>
        {
          doctors.sort((d1, d2) => d1.username > d2.username).map((doctor, index) => {
            return (
              <DoctorDisplay
                key={ doctor.id }
                selected={ currentQueueDoctorId === doctor.id }
                doctor={ doctor }
                gameId={ gameId }
                onChangeQueue={ this.onChangeQueue.bind(this, gameId, doctor.id, patientId) }
                onExitQueue={ this.leaveQueue.bind(this, gameId, doctor.id, patientId) }
              />
            );
          })
        }
      </Paper>
      : null
    )
  }
}

export default withAuthorization(withFirebase(withRouter(withStyles(styles)(DoctorDisplayList))));
