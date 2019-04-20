import DoctorDisplay from '../DoctorDisplay';
import React from 'react';
import WaitingRoom from '../WaitingRoom';
import { withStyles } from '@material-ui/core';
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
    }
    
    render(){
      return (
        <div>
          <DoctorDisplay
            gameId='qoVCDFTTrzDSDq42BtWO'
            doctorId='2szEfr9IKP4lhHfoUszi' />
          <WaitingRoom />
        </div>
      )
    }
}

export default withRouter(withStyles(styles)(Lobby));
