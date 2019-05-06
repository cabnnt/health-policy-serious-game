import firebase from 'firebase';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';
import TreatmentButton from './TreatmentButton';
import RecommendationPanel from './RecommendationPanel';

class TreatmentPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: null,
      currentPatient: null,
      diagnosis: null,
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
    const firestore = this.props.firebase.db;
    const { queue, currentPatient } = this.state;
    const { gameId, doctorId } = this.props;
    
    firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctorId)
      .update({
        queue: firebase.firestore.FieldValue.arrayRemove(queue[0]),
        currentPatient: queue[0],
      })
      .then(() => {
        this.setState({ currentPatient: queue[0], queue: queue.slice(1) });
      });
  }

  cancelTreatment() {
    const { queue, currentPatient } = this.state;
    const { gameId, doctorId } = this.props;
    const firestore = this.props.firebase.db;
    const doctorReference = gameId && doctorId
      ? firestore
          .collection('games')
          .doc(gameId)
          .collection('doctors')
          .doc(doctorId)
      : null;

    if (doctorReference) {
      const newCurrentPatient = null;
      const newQueue = [currentPatient, ...queue];

      return firestore
        .runTransaction(transaction => {
          return transaction
            .get(doctorReference)
            .then(doctorDocument => {
              if (doctorDocument.exists) {
                transaction.update(doctorReference, {
                  currentPatient: newCurrentPatient,
                  queue: newQueue,
                })
              }
            });
        })
        .then(() => {
          this.setState({
            currentPatient: newCurrentPatient,
            queue: newQueue,
          })
        });
    }
  }

  finishTreatment() {
    const { gameId, doctorId } = this.props;
    const { diagnosis, currentPatient, queue } = this.state;
    const firestore = this.props.firebase.db;
    const doctorReference = gameId && doctorId && diagnosis
      ? firestore
          .collection('games')
          .doc(gameId)
          .collection('doctors')
          .doc(doctorId)
      : null;
    
    if (doctorReference) {
      return firestore
        .runTransaction(transaction => {
          return transaction
            .get(doctorReference)
            .then(doctorDocument => {
              if (doctorDocument.exists) {
                transaction.set(
                  doctorReference,
                  {
                    diagnoses: {
                      [currentPatient]: diagnosis
                    },
                  },
                  {
                    merge: true
                  },
                );
                transaction.update(
                  doctorReference,
                  {
                    currentPatient: null,
                  }
                );
              }
            })
        });
    }
  }

  handleDiagnosisChange(diagnosis) {
    this.setState({ diagnosis });
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

    return(
      doctor
      ? 
        <div>
          <Typography style={{ margin: 5 }} variant='body2'>
            There are currently { queue ? queue.length : -1 } patient(s) waiting to see you.
          </Typography>
          <Typography style={{ margin: 5 }} variant='body2'>
            {
              currentPatient
                ? `You are currently treating: ${currentPatient}.`
                : `You are not currently treating anybody.`
            }
          </Typography>
          {
            currentPatient
              ? <div>
                  <RecommendationPanel onSelectionChange={ this.handleDiagnosisChange.bind(this) }/>
                  <TreatmentButton
                    buttonText={ 'Cancel treatment' }
                    onClick={ this.cancelTreatment.bind(this) }
                    disabled={ !currentPatient }
                  />
                  <TreatmentButton
                    buttonText={ 'Finish treatment' }
                    onClick={ this.finishTreatment.bind(this) }
                  />
                </div>
              : <TreatmentButton
                  buttonText={ 'Next patient' }
                  onClick={ this.startTreatment.bind(this) }
                  disabled={ queue ? queue.length === 0 : true }
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
