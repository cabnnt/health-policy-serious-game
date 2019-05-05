import React from 'react'
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
    if (completed) {
      // Render a complete state
      return <Complete />;
    } else {
      // Render a countdown
      return <span>{hours}:{minutes}:{seconds}</span>;
    }
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
                startTime = moment(doc.get('startTime'))
                this.setState({timeLeft, startTime})
            });
    }
    render(){
        if(moment(this.state.startTime).isAfter(moment())){
            return (<span>Hold your horses! The game {this.props.gameInfo.currentGame} has not begun yet!</span>)
        }
        return (<Counter date={Date.parse(this.state.startTime) + this.state.timeLeft*DEV_SECONDS} renderer = {renderer}/>)
    }
}
export default withFirebase(Countdown);