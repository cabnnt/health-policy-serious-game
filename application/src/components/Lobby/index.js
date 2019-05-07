import Countdown from '../Countdown';
import DoctorDisplayList from '../DoctorDisplayList';
import Paper from '@material-ui/core/Paper';
import queryString from 'query-string';
import React, { Component } from 'react';
import TreatmentPanel from '../TreatmentPanel';
import Typography from '@material-ui/core/Typography';
import { withAuthorization } from '../Authorization/context';
import { withFirebase } from '../Firebase';
import { Redirect, withRouter } from 'react-router-dom';
import { illmatic } from '../../js/stringGen';

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
        finishedTreatment: false,
        isSick : false,
        infectionString : "",
        redirect: false,
      }
      this.doctors = [];
    }

    componentDidMount() {
      const { location } = this.props;
      const firestore = this.props.firebase.db;
      const { search } = location;
      const { gameId } = queryString.parse(search);
      const gameRequest = gameId ? firestore.collection('games').doc(gameId) : null;

      if (gameRequest) {
        gameRequest
        .get()
        .then(gameDocument => {
          const gameExists = !!gameDocument && gameDocument.exists;
          const { authUser } = this.props;
          if (authUser && gameExists) {
            gameRequest
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
          const { authUser } = this.props
          if (authUser) {
            const { loading } = this.state;
            const gameDocument = await gameRequest.get();
            const gameExists = !!gameDocument && gameDocument.exists;
            const infection = await illmatic();
            
            const { players } = gameDocument
              ? gameDocument.exists && gameDocument.data()
              : null;
            const isPlayer = players ? players.includes(this.props.authUser.username) : false;
          
            firestore
              .collection('users')
              .doc(authUser.id)
              .update({
                infectionString : infection[0],
                isSick : infection[1]
              }).then(()=>{
                this.setState({
                  infectionString: infection[0],
                  isSick: infection[1]
                })
              })
              if (loading) {
                this.setState({
                  gameExists: gameExists,
                  loading: false,
                  isPlayer: isPlayer
                });
              }
          } else {
            this.setState({ redirect: true });
          }
        });
      } else {
        this.setState({
          gameExists: false,
          loading: false,
          isPlayer: false,
        });
      }
    }

    onFinishTreatment() {
      this.setState({
        finishedTreatment: true,
      })
    }
    
    render() {
      const { loading, gameExists, isDoctor, isPlayer, finishedTreatment } = this.state;
      const { location, authUser } = this.props;
      const { gameId } = queryString.parse(location.search);

      console.log('finished treatment (lobby)', finishedTreatment);

      return (
        authUser ?
          <Paper style={{ margin: 10 }}>
            {
              !loading
              ? gameExists
              ? isDoctor
              ? <div>
                        <Typography style={{ margin: 5 }} variant='body2' color='error'>Your name: {authUser.username}</Typography>
                        <Countdown gameInfo={authUser}/>
                        <TreatmentPanel
                          gameId={ gameId }
                          doctorId={ authUser.id }
                          finishedTreatment={ finishedTreatment } />
                      </div>
                    : isPlayer || authUser.role === 'teacher'
                    ? <div>
                          <Typography style={{ margin: 5 }} variant='body2' color='error'>Your name: {authUser.username}</Typography>
                          <Countdown gameInfo={ authUser }/>
                          <DoctorDisplayList
                            gameId={ gameId }
                            onFinishTreatment={ this.onFinishTreatment.bind(this) }
                          />
                          <Typography style={{ margin: 5 }} variant='body2' color='error'>Your string: {this.state.infectionString}</Typography>
                        </div>
                      : <div></div>
                  : <Typography style={{ margin: 5 }} variant='body2' color='error'>There is no game with the provided ID.</Typography>
                : <Typography style={{ margin: 5 }} variant='body2'>Loading lobby...</Typography>
            }
          </Paper>
          : <Redirect to='/home'/>
      )
    }
}

export default withAuthorization(withFirebase(withRouter(Lobby)));
