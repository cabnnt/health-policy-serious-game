import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';

class TreatmentPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: null,
      queue: [],
    }
    this.doctorListener = null;
  }

  componentDidMount() {
    const firestore = this.props.firebase.db;
    const { doctorId, gameId } = this.props;
    const doctorRequest = firestore
      .collection('games')
      .doc(gameId) // what happens if we throw this a bogus gameId?
      .collection('doctors')
      .doc(doctorId)
    this.doctorListener = doctorRequest
      .onSnapshot(doctorDocument => {
        const doctor = doctorDocument && doctorDocument.exists
          ? doctorDocument.data()
          : null;
        const queue = doctor
          ? doctor.queue
          : [];
        this.setState({ doctor, queue });
      });
  }

  componentWillUnmount() {
    this.doctorListener && this.doctorListener();
  }

  render() {
    const { doctor, queue } = this.state;
    const currentPatient = queue.length > 0 ? queue[0] : null;

    return(
      doctor
      ? 
        <div>
          <Typography style={{ margin: 5 }} variant='body2'>
            {
              currentPatient
                ? `You are currently treating: ${currentPatient}.`
                : `You currently have no patients to treat.`
            }
          </Typography>
          <Typography style={{ margin: 5 }} variant='body2'>
            There are currently { queue.length } patient(s) waiting to see you.
          </Typography>
          <button onClick={() => {}}>
            Next patient
          </button>
        </div>
      : null
    )
  }
}

TreatmentPanel.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctorId: PropTypes.string.isRequired,
};

export default withFirebase(TreatmentPanel);
