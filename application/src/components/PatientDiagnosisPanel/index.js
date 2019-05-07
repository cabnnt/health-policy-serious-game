import Divider from '@material-ui/core/Divider';
import firebase from 'firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import NumberFormat from 'react-number-format';
import numeral from 'numeral'
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';

class PatientDiagnosisPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minorTreatmentCost: 0.00,
      majorTreatmentCost: 0.00,
    }
  }

  componentDidMount() {
    const { gameId } = this.props;
    const firestore = this.props.firebase.db;
    
    firestore
      .collection('games')
      .doc(gameId)
      .get()
      .then(gameDocument => {
        if (gameDocument && gameDocument.exists) {
          const { minorTreatmentCost, majorTreatmentCost } = gameDocument.data();
          this.setState({ minorTreatmentCost, majorTreatmentCost });
        }
      });
  }

  handleTreatmentSelection(treatment, gameId, patientId, doctorId) {
    const { onFinishTreatment } = this.props;
    const firestore = this.props.firebase.db;
    const doctorReference = gameId && patientId && doctorId
      ? firestore
          .collection('games')
          .doc(gameId)
          .collection('doctors')
          .doc(doctorId)
      : null

    if (doctorReference) {
      if (['none', 'minor', 'major'].includes(treatment)) {
        doctorReference
          .update({
            currentPatient: null,
            queue: firebase.firestore.FieldValue.arrayRemove(patientId),
          })
        doctorReference
          .set({
            results: {
              [patientId]: {
                selectedTreatment: treatment
              }
            }
          },
          {
            merge: true,
          });

          onFinishTreatment();
      }
    }
  }

  render() {
    const { doctor, gameId, patientId } = this.props;
    const { majorTreatmentCost, minorTreatmentCost } = this.state;
    const diagnosis = doctor && 
      doctor.results &&
      doctor.results[patientId] &&
      doctor.results[patientId].diagnosis;

    return(
      doctor
        ? diagnosis
          ? <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Paper style={{ margin: 10, maxWidth: 400, height: '90%' }}>
                  <List>
                    <ListItem>
                      <ListItemText primary='Diagnosis' secondary='The doctor made the following observations about your condition' />
                    </ListItem>
                  </List>
                  <Divider style={{ width: '100%' }} />
                  <List>
                    <ListItem style={{ paddingLeft: '30px' }}>
                      <ListItemText primary={ diagnosis.severity } secondary='Severity of the diagnosis' />
                    </ListItem>
                    <ListItem style={{ paddingLeft: '30px' }}>
                      <ListItemText primary={ diagnosis.certainty } secondary='Confidence in their diagnosis' />
                    </ListItem>
                    <ListItem style={{ paddingLeft: '30px' }}>
                      <ListItemText primary={ diagnosis.treatment } secondary='Recommended treatment' />
                    </ListItem>
                  </List>
                </Paper>
                <br />
                <Paper style={{ margin: 10, maxWidth: 400, height: '90%' }}>
                  <List>
                    <ListItem>
                      <ListItemText primary='Select your treatment' secondary='Choose your treatment option, or queue with another doctor' />
                    </ListItem>
                  </List>
                  <Divider />
                  <List>
                    <ListItem style={{ paddingLeft: '30px' }} button onClick={ this.handleTreatmentSelection.bind(this, 'minor', gameId, patientId, doctor.id) }>
                      <ListItemText primary={ 'Minor treatment' } secondary={ `Cost is $n, and target price is $${numeral(minorTreatmentCost).value()}.` } />
                    </ListItem>
                    <ListItem style={{ paddingLeft: '30px' }} button onClick={ this.handleTreatmentSelection.bind(this, 'major', gameId, patientId, doctor.id) }>
                      <ListItemText primary={ 'Major treatment' } secondary={ `This doctor's cost is $n+1, and target price is $${numeral(majorTreatmentCost).value()}.` } />
                    </ListItem>
                    <ListItem style={{ paddingLeft: '30px' }} button onClick={ this.handleTreatmentSelection.bind(this, 'none', gameId, patientId, doctor.id) }>
                      <ListItemText primary={ 'No treatment' } secondary={ `No cost, but you will have to seek treatment from another doctor.` } />
                    </ListItem>
                  </List>
                </Paper>
                <br />
              </div>
          : <Typography
              style={{ margin: 5 }}
              variant='body2'
            >
              You are being treated by Dr. { doctor.username }.
            </Typography>
        : <Typography
            style={{ margin: 5 }}
            variant='body2'
            color='error'
          >
            Could not find associated doctor.
          </Typography>
    )
  }
}

PatientDiagnosisPanel.propTypes = {
  doctor: PropTypes.object.isRequired,
  patientId: PropTypes.string.isRequired,
  gameId: PropTypes.string.isRequired,
  onFinishTreatment: PropTypes.func.isRequired,
}

export default withFirebase(PatientDiagnosisPanel);
