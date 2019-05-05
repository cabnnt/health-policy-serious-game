import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';

const ExitQueueButton = (props) => {
  const { gameId, doctorId, patientId } = props;
  
  const handleExitQueue = () => {
    const { onExitQueue } = props;
    onExitQueue(gameId, doctorId, patientId);
  }

  return(
    <Button onClick={ handleExitQueue }>
      Exit queue
    </Button>
  )
}

ExitQueueButton.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctorId: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
}

export default ExitQueueButton;
