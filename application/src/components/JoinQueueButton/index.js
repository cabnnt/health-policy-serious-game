import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { withFirebase } from '../Firebase';
import firebase from 'firebase';

const JoinQueueButton = props => {
  const { gameId, doctorId, patientId, disabled } = props;
  const firestore = props.firebase.db;
  
  const handleJoinQueue = () => {
    firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctorId)
      .update({
        queue: firebase.firestore.FieldValue.arrayUnion(patientId)
      });
  }
  
  const handleLeaveQueue = () => {
    firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctorId)
      .update({
        queue: firebase.firestore.FieldValue.arrayRemove(patientId)
      });
  }

  return(
    <div>
      <Button
        disabled={ disabled }
        onClick={ handleJoinQueue }>
        Join queue
      </Button>
      
      <Button
        disabled={ disabled }
        onClick={ handleLeaveQueue }>
        Leave queue
      </Button>
    </div>
  );
}

JoinQueueButton.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctorId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
}

export default withFirebase(JoinQueueButton);
