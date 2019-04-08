import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from '../ButtonAppBar';
import TabContainer from '../TabContainer';
import SimplePopper from '../SimplePopper';
import classes from './lobby.scss';
import WaitingRoom from '../WaitingRoom';
import { withStyles } from '@material-ui/core';
import QueueList from '../QueueList';

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
          <QueueList />
          <WaitingRoom></WaitingRoom>
        </div>
        )
    }
}
export default withStyles(styles)(Lobby);