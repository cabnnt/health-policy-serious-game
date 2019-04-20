import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withFirebase } from '../Firebase';
import PropTypes from 'prop-types';

class DoctorDisplay extends Component {
  constructor(props) {
    super(props)
    this.doctorListener = null;
    this.state = {
      queue: []
    }
  }

  componentDidMount() {
    const { gameId, doctorId } = this.props;
    const firestore = this.props.firebase.db;

    this.doctorListener = firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .doc(doctorId)
      .onSnapshot(doctorDocument => {
        const { queue } = doctorDocument.data();
        this.setState({
          queue: queue
        });
      })
  }

  componentWillUnmount() {
    this.doctorListener && this.doctorListener();
  }

  render() {
    const { queue } = this.state;
    return(
      <Paper>
        <p>Doctor</p>
        <p>Queue length: { queue ? queue.length : 0 }</p>
      </Paper>
    )
  }
}

DoctorDisplay.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctorId: PropTypes.string.isRequired,
}

export default withFirebase(DoctorDisplay);
