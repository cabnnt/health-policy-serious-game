import Countdown from '../Countdown';
import DoctorDisplayList from '../DoctorDisplayList';
import Paper from '@material-ui/core/Paper';
import queryString from 'query-string';
import React, { Component } from 'react';
import TreatmentPanel from '../TreatmentPanel';
import Typography from '@material-ui/core/Typography';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

const styles = {
    doctor: {
        display: 'inline-block',
        margin: 10,
        color:"red",
        backgroundColor:"blue",
    }
}

class Lobby extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        loading: true,
        gameExists: false,
        isPlayer: false,
        isDoctor: false,
      }
      this.doctors = [];
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
          const { authUser } = this.props;
          
          if (authUser && gameExists) {
            this.doctorsListener = gameRequest
              .collection('doctors')
              .get()
              .then(doctorCollection => {
                doctorCollection.forEach(doctor => {
                  this.doctors = this.doctors.concat(doctor.data());
                });
              }).then(() => {
                this.setState({
                  gameExists: true,
                  isDoctor: this.doctors.filter(doctor => doctor.id === authUser.id).length > 0,
                  loading: false,
                });
              });
          }
        })
        .then(async () => {
          const { loading } = this.state;
          const gameDocument = await gameRequest.get();
          const gameExists = !!gameDocument && gameDocument.exists;
          const { players } = gameDocument
            ? gameDocument.exists && gameDocument.data()
            : null;
          const isPlayer = players ? players.includes(this.props.authUser.username) : false;

          if (loading) {
            this.setState({
              gameExists: gameExists,
              loading: false,
              isPlayer: isPlayer
            });
          }
        });
    }
    
    render() {
      const { loading, gameExists, isDoctor, isPlayer } = this.state;
      const { location, authUser } = this.props;
      const { gameId } = queryString.parse(location.search);

      return (
        authUser ?
          <Paper style={{ margin: 10 }}>
            {
              !loading
                ? gameExists
                  ? isDoctor
                    ? <TreatmentPanel doctorId={ authUser.id } />
                    : isPlayer
                      ? <div>
                          <Countdown gameInfo={ authUser }/>
                          <DoctorDisplayList
                            gameId={ gameId }
                          />
                        </div>
                      : <Typography style={{ margin: 5 }} variant='body2'>You haven't joined this game.</Typography>
                  : <Typography style={{ margin: 5 }} variant='body2' color='error'>There is no game with the provided ID.</Typography>
                : <Typography style={{ margin: 5 }} variant='body2'>Loading lobby...</Typography>
            }
          </Paper>
          : null
      )
    }
}

export default withAuthorization(withFirebase(withRouter(Lobby)));
