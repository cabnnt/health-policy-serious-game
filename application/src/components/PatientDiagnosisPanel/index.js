import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';

class PatientDiagnosisPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { doctor } = this.props;

    return(
      doctor
        ? <Typography
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
}

export default withFirebase(PatientDiagnosisPanel);
