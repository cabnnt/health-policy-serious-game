import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from '../ButtonAppBar';
import TabContainer from '../TabContainer';
import SimplePopper from '../SimplePopper';
import classes from './lobby.scss';
import WaitingRoom from '../WaitingRoom';
import { withStyles } from '@material-ui/core';
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
        // this.state();
    }
    render(){
        return (
        <div>
                <div className={this.props.classes.doctorqueue}>
                    <div className="doctor"><SimplePopper className={this.props.classes.doctor} name="Nicole"></SimplePopper></div>
                    <div className="doctor"><SimplePopper className={this.props.classes.doctor} name="MacKenzie"></SimplePopper></div>
                    <div className="doctor"><SimplePopper className={this.props.classes.doctor} name="Mitchell"></SimplePopper></div>
                </div>
                <WaitingRoom></WaitingRoom>
        </div>
        )
    }
}
export default withStyles(styles)(Lobby);