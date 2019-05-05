import DoctorDisplayList from '../DoctorDisplayList';
import Paper from '@material-ui/core/Paper';
import queryString from 'query-string';
import React, { Component } from 'react';
import TreatmentPanel from '../TreatmentPanel';
import Typography from '@material-ui/core/Typography';
import WaitingRoom from '../WaitingRoom';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class Lobby extends Component {
    constructor(props){
      super(props);
      this.state = {
        loaded: false,
        gameExists: false,
        doctors: [],
        isDoctor: false,
      }
      this.doctorsListener = null;
    }

    componentDidMount() {
      const { location } = this.props;
      const firestore = this.props.firebase.db;
      const { search } = location;
      const { gameId } = queryString.parse(search);
      const gameRequest = firestore.collection('games').doc(gameId);

      gameRequest
        .get()
        .then(gameDocument => {
          const gameExists = !!gameDocument && gameDocument.exists;
          
          if (gameExists) {
            this.doctorsListener = gameRequest
              .collection('doctors')
              .onSnapshot(async doctorCollection => {
                await doctorCollection.forEach(doctor => {
                  const { doctors } = this.state;
                  this.setState({
                    doctors: doctors.concat(doctor.data()),
                  });
                });

                const { authUser } = this.props;
                const { doctors } = this.state;
                this.setState({
                  gameExists: true,
                  isDoctor: doctors.filter(doctor => doctor.id === authUser.id).length > 0,
                  loaded: true,
                })
              });
          }
        })
    }

    componentWillUnmount() {
      this.doctorsListener && this.doctorsListener();
    }
    
    render() {
      const { loaded, gameExists, doctors, isDoctor } = this.state;
      const { location, authUser } = this.props;
      const { gameId } = queryString.parse(location.search);

      return (
        <Paper style={{ margin: 10 }}>
          {
            loaded
              ? isDoctor
                ? <TreatmentPanel doctorId={ authUser.id } />
                : <DoctorDisplayList
                    gameId={ gameId }
                  />
              : <Typography style={{ margin: 5 }} variant='body2'>Loading lobby...</Typography>
          }
        </Paper>
      )
    }
}

export default withAuthorization(withFirebase(withRouter(Lobby)));
