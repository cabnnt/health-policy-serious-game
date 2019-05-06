import React from 'react'
import {Route, Redirect} from 'react-router'
import { withFirebase } from '../Firebase'
import moment from 'moment'
import Counter from 'react-countdown-now'
import { withAuthorization } from '../Authorization/context';
import {illmatic} from '../../js/stringGen'
const INITIAL_STATE = {
    timeLeft : 0,
    startTime : 0,
    isStarted : false
}
const PRODUCTION_SECONDS = 60000
const DEV_SECONDS = 1000
const Complete = () => <span>You have completed the game </span>
const renderer = ({ hours, minutes, seconds, completed }) => {
    return <span>{hours}:{minutes}:{seconds}</span>;
  };
class Countdown extends React.Component{
    
    constructor(props){
        super(props);
        this.state = INITIAL_STATE
        this.firestore = this.props.firebase.db;
        this.timerListener = null;
        // console.log(illmatic())
    }

    componentWillUnmount(){
        this.timerListener && this.timerListener()
    }
    componentDidMount(){
        const {gameInfo} = this.props;
        this.timerListener = this.firestore
        .collection('games')
        .onSnapshot(doc=>{
            doc.forEach(element => {
                console.log(element.get('startTime'))
                if(element.id === gameInfo.currentGame){
                    console.log(element.get('startTime'))
                    let startTime = moment(element.get('startTime').toDate())
                    let timeLeft = element.get('roundTime')
                    this.setState({startTime,timeLeft})
                    if(startTime.isSameOrBefore(moment())){
                        this.setState({isStarted: true});
                    }
                }
            });
        })
    }
    render(){
        //TODO: when time expires remove people from game in DB
        return this.state.isStarted ? (<div>Time Remaining : <Counter date={this.state.startTime + this.state.timeLeft*PRODUCTION_SECONDS} renderer = {renderer}/></div>) : <span>Please wait until the game starts</span>;
    }
}
export default withFirebase(Countdown);