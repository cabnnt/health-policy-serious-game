import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Authorization/context';

const JoinQueueButton = props => {
  const { gameId, doctorId, patientId, disabled } = props;
  
  const handleJoinQueue = () => {
    const { onChangeQueue } = props;
    onChangeQueue(gameId, doctorId, patientId)
  }

  return(
    <div>
      <Button
        disabled={ disabled }
        onClick={ handleJoinQueue }>
        Join queue
      </Button>
    </div>
  );
}

JoinQueueButton.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctorId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
  onChangeQueue: PropTypes.func.isRequired
}

export default withAuthorization(withFirebase(JoinQueueButton));
