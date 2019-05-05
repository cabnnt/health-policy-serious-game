import React, { Component } from 'react';
import DoctorDisplay from '../DoctorDisplay';
import queryString from 'query-string';
import Typography from '@material-ui/core/Typography';
import { withAuthorization } from '../Authorization/context';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';

class DoctorDisplayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      currentQueueDoctorId: null,
      gameId: queryString.parse(this.props.location.search).gameId,
      isDoctor: false,
      loaded: false,
      numberOfDoctors: 0,
    }
    this.firestore = this.props.firebase.db;
    this.doctorListener = null;
  }

  async componentDidMount() {
    const { gameId } = this.state;
    
    const gameDocument = await this.firestore
      .collection('games')
      .doc(gameId)
      .get()
    const { numberOfDoctors } = gameDocument.data();
    
    this.doctorListener = this.firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .onSnapshot(doctorsCollection => {
        const { authUser } = this.props;
        doctorsCollection.forEach(doctorDocument => {
          this.addDoctor({ id: doctorDocument.id, ...doctorDocument.data() });
          this.setState({ isDoctor: !!authUser && (authUser.id === doctorDocument.id) });
        });
      });
    this.setState({ numberOfDoctors: numberOfDoctors, loaded: true });
  }

  componentWillUnmount() {
    this.doctorListener && this.doctorListener();
    this.setState({ loaded: false });
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
    const { gameId, doctors, currentQueueDoctorId, loaded, numberOfDoctors } = this.state;
    const { authUser } = this.props;
    const patientId = authUser ? authUser.id : null;

    return (
      loaded
        ? doctors.length === 0 || doctors.length < numberOfDoctors
          ? <Typography style={{ margin: 5 }} variant='body2'>Waiting on { numberOfDoctors - doctors.length } doctors to join the game...</Typography>
          : authUser
            ? doctors.sort((d1, d2) => d1.username > d2.username).map((doctor, index) => {
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
              : null
        : <Typography style={{ margin: 5 }} variant='body2'>Loading doctors...</Typography>
    )
  }
}

export default withAuthorization(withFirebase(withRouter(DoctorDisplayList)));
