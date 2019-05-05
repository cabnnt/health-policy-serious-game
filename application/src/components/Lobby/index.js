import DoctorDisplayList from '../DoctorDisplayList';
import React from 'react';
import WaitingRoom from '../WaitingRoom';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import Countdown from '../Countdown';

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
          <Countdown gameInfo = {this.props.authUser}/>
          <DoctorDisplayList authUser= {this.props.authUser}/>
        </div>
      )
    }
}

export default withRouter(withStyles(styles)(Lobby));
