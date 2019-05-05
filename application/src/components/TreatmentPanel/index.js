import PropTypes from 'prop-types';
import React, { Component } from 'react';

class TreatmentPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { doctorId } = this.props;

    return(
      doctorId
      ? <div>
          <p>
            Dr. { doctorId } is currently treating { 'abc' }.
          </p>
          
          {
            /* TODO: make a NextPatientButton */
          }
          <button onClick={() => {}}>
            Next patient
          </button>
        </div>
      : <p>Empty treatment panel</p>
    )
  }
}

TreatmentPanel.propTypes = {
  doctorId: PropTypes.string.isRequired,
}

export default TreatmentPanel;
