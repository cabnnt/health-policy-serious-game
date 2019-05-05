import React from 'react'
import {Route, Redirect} from 'react-router'
import { withFirebase } from '../Firebase'
import moment from 'moment'
import Counter from 'react-countdown-now'
const INITIAL_STATE = {
    timeLeft : 0,
    startTime : 0,
    isStarted : false
}
const PRODUCTION_SECONDS = 60000
const DEV_SECONDS = 1000
const Complete = () => <span>You have completed the game </span>
const renderer = ({ hours, minutes, seconds, completed }) => {
    console.log(completed)
    return completed ? <Redirect to='/home'/> : <span>{hours}:{minutes}:{seconds}</span>;
  };
class Countdown extends React.Component{
    
    constructor(props){
        super(props);
        this.state = INITIAL_STATE
        this.firestore = this.props.firebase.db;
    }

    componentDidMount(){
        let timeLeft = 0
        let startTime = 0 
        const {gameInfo} = this.props;
        this.firestore
            .collection('games')
            .doc(gameInfo.currentGame)
            .get()
            .then(doc=>{
                timeLeft = doc.get('roundTime')
                startTime = doc.get('startTime')
                console.log(startTime)
                this.setState({timeLeft, startTime})
            });
    }
    render(){
        console.log(this.state.startTime)
        return (<Counter date={Date.parse(this.state.startTime) + this.state.timeLeft*PRODUCTION_SECONDS} renderer = {renderer}/>)
    }
}
export default withFirebase(Countdown);