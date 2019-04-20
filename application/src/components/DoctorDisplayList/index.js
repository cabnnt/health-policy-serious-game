import React, { Component } from 'react';
import DoctorDisplay from '../DoctorDisplay';
import Paper from '@material-ui/core/Paper';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  main: {
    margin: 10
  }
}

class DoctorDisplayList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors: [],
      gameId: queryString.parse(this.props.location.search).gameId
    }
  }

  componentDidMount() {
    const { gameId } = this.state;
    const firestore = this.props.firebase.db;
    
    firestore
      .collection('games')
      .doc(gameId)
      .collection('doctors')
      .onSnapshot(doctorsCollection => {
        doctorsCollection.forEach(doctorDocument => {
          this.addDoctor({ id: doctorDocument.id, ...doctorDocument.data() })
        });
      });
  }

  addDoctor(doctor) {
    const { doctors } = this.state;
    const unique = doctors.filter(d => d.id === doctor.id).length === 0;
    if (unique) {
      this.setState({
        doctors: doctors.concat(doctor)
      })
    }
  }

  render() {
    const { gameId, doctors } = this.state;
    const { classes } = this.props;

    return (
      <Paper className={ classes.main }>
        {
          doctors.map((doctor, index) => {
            return (
              <DoctorDisplay
                doctor={ doctor }
                gameId={ gameId } />
            );
          })
        }
      </Paper>
    )
  }
}

export default withFirebase(withRouter(withStyles(styles)(DoctorDisplayList)));
