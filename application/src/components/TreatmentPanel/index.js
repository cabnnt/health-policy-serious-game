import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';
import TreatmentButton from './TreatmentButton';

class TreatmentPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: null,
      currentPatient: null,
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

  startTreatment() {
    const { queue } = this.state;
    this.setState({ currentPatient: queue.shift() });
  }

  cancelTreatment() {
    const { queue, currentPatient } = this.state;
    this.setState({
      currentPatient: null,
      queue: [currentPatient, ...queue],
    })
  }

  componentWillUnmount() {
    const { currentPatient } = this.state;
    this.doctorListener && this.doctorListener();
    
    if (currentPatient) {
      this.cancelTreatment();
    }
  }

  render() {
    const { doctor, queue, currentPatient } = this.state;
    console.log(this.state);

    return(
      doctor
      ? 
        <div>
          <Typography style={{ margin: 5 }} variant='body2'>
            {
              currentPatient
                ? `You are currently treating: ${currentPatient}.`
                : `You are not currently treating anybody.`
            }
          </Typography>
          <Typography style={{ margin: 5 }} variant='body2'>
            There are currently { queue.length } patient(s) waiting to see you.
          </Typography>
          {
            currentPatient
              ? <div>
                  <TreatmentButton
                    buttonText={ 'Cancel treatment' }
                    onClick={ this.cancelTreatment.bind(this) }
                    disabled={ false }
                  />
                  <TreatmentButton
                    buttonText={ 'Finish treatment' }
                    onClick={() => console.log('finish')}
                    disabled={ false }
                  />
                </div>
              : <TreatmentButton
                  buttonText={ 'Next patient' }
                  onClick={ this.startTreatment.bind(this) }
                  disabled={ queue.length > 0 }
                />
          }
          <Prompt
            when={ !!currentPatient }
            message={
              `Navigating away will cancel treatment without saving changes.`
            }
          />
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
