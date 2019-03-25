import React from 'react';
import ReactDOM from 'react-dom';
import ButtonAppBar from '../ButtonAppBar';
import TabContainer from '../TabContainer';
import SimplePopper from '../SimplePopper';
import classes from './lobby.scss';
import WaitingRoom from '../WaitingRoom';
export default class Lobby extends React.Component{
    constructor(props){
        super(props);
        // this.state();
    }
    render(){
        return (
        <div>
                <ButtonAppBar></ButtonAppBar>
                <div className={`${classes.doctorqueue}`}>
                    <div><SimplePopper className={`${classes.doctor}`} name="Mitchell"></SimplePopper></div>
                    <div><SimplePopper className={`${classes.doctor}`} name="Nicole"></SimplePopper></div>
                    <div><SimplePopper className={`${classes.doctor}`} name="MacKenzie"></SimplePopper></div>
                </div>
                <WaitingRoom></WaitingRoom>
        </div>
        )
    }
}