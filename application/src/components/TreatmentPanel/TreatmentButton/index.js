import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';

const TreatmentButton = (props) => {
  const { onClick, buttonText, disabled } = props;

  return(
    <Button style={{ margin: 5 }} onClick={ onClick } disabled={ disabled ? disabled : false }>
      { buttonText }
    </Button>
  )
}

TreatmentButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default TreatmentButton;
