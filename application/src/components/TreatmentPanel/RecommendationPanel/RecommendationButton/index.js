import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';

const RecommendationButton = (props) => {
  const { onClick, buttonText } = props;

  return(
    <Button style={{ margin: 5 }} onClick={ onClick }>
      { buttonText }
    </Button>
  )
}

RecommendationButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default RecommendationButton;
