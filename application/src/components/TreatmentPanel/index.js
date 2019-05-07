import firebase from 'firebase';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';
import TreatmentButton from './TreatmentButton';
import RecommendationPanel from './RecommendationPanel';
import { finished } from 'stream';

class TreatmentPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor: null,
      currentPatient: null,
      diagnosis: null,
      queue: [],
      finishedTreatment: false,
      assignedTreatment: false,
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
        const queue = doctor && doctor.queue;
        const { currentPatient, results } = doctor;
        const patientResults = results && currentPatient && results[currentPatient];
        const assignedTreatment = !!(patientResults && patientResults.diagnosis);
        const finishedTreatment = currentPatient ? !!(
          patientResults
            && patientResults.selectedTreatment
            && patientResults.treated !== false
        ) : true;

        this.setState({ doctor, queue, finishedTreatment, assignedTreatment });

        if (finishedTreatment) {
          doctorRequest
            .update({ currentPatient: null })
            .then(() => {
              this.setState({ currentPatient: null, startedTreatment: false, assignedTreatment: false });
            })
        } else if (!finishedTreatment && assignedTreatment) {
          this.setState({ startedTreatment: true });
        }
      });
    
  }

  startTreatment() {
    const firestore = this.props.firebase.db;
    const { queue } = this.state;
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
        this.setState({ startedTreatment: true, currentPatient: queue[0], queue: queue.slice(1) });
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
            startedTreatment: false,
            assignedTreatment: false,
            currentPatient: newCurrentPatient,
            queue: newQueue,
          })
        });
    }
  }

  assignTreatment() {
    const { gameId, doctorId } = this.props;
    const { diagnosis, currentPatient, doctor } = this.state;
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
              if (doctorDocument.exists && (doctor && doctor.results && doctor.results[currentPatient] && doctor.results[currentPatient].treated) !== false) {
                transaction.set(
                  doctorReference,
                  {
                    results: {
                      [currentPatient]: {
                        diagnosis: diagnosis,
                      }
                    },
                  },
                  {
                    merge: true
                  },
                );
              } else if (doctorDocument.exists && (doctor && doctor.results && doctor.results[currentPatient] && doctor.results[currentPatient].treated) === false) {
                let { results } = { ...doctor };
                delete results[currentPatient];
                results[currentPatient] = { diagnosis: diagnosis };

                transaction.set(
                  doctorReference,
                  {
                    results: results,
                  },
                  { merge: true }
                );
              }
            })
        }).then(
          this.setState({ assignedTreatment: true })
        )
    }
  }

  handleDiagnosisChange(diagnosis) {
    this.setState({ diagnosis });
  }

  componentWillUnmount() {
    this.doctorListener && this.doctorListener();
  }

  render() {
    const { doctor, queue, currentPatient, startedTreatment, assignedTreatment, finishedTreatment } = this.state;

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
            startedTreatment
              ? <div>
                  <RecommendationPanel onSelectionChange={ this.handleDiagnosisChange.bind(this) }/>
                  <TreatmentButton
                    buttonText={ 'Cancel treatment' }
                    onClick={ this.cancelTreatment.bind(this) }
                    disabled={ assignedTreatment && !finishedTreatment }
                  />
                  {
                    assignedTreatment && !finishedTreatment
                      ? <TreatmentButton
                          buttonText={ 'Awaiting patient response...' }
                          onClick={ () => {} }
                          disabled={ true }
                        />
                      : <TreatmentButton
                          buttonText={ 'Assign treatment' }
                          onClick={ this.assignTreatment.bind(this) }
                        />
                  }
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
