import React from 'react'
import {Route, Redirect} from 'react-router'
import { withFirebase } from '../Firebase'
import moment from 'moment'
import Counter from 'react-countdown-now'
import { withAuthorization } from '../Authorization/context';
import {illmatic} from '../../js/stringGen'
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
const INITIAL_STATE = {
    timeLeft : 0,
    startTime : 0,
    isStarted : false
}
const PRODUCTION_SECONDS = 60000
const DEV_SECONDS = 1000
const Complete = () => <span>You have completed the game </span>
const renderer = ({ hours, minutes, seconds, completed }) => {
    return <Typography>{hours}:{minutes}:{seconds}</Typography>;
  };
class Countdown extends React.Component{
    
    constructor(props){
        super(props);
        this.state = INITIAL_STATE
        this.firestore = this.props.firebase.db;
        this.timerListener = null;
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
                if(element.id === gameInfo.currentGame){
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
        const style = { margin: 10, width: '15%', maxWidth: 150, minHeight: 15 };
        //TODO: when time expires remove people from game in DB
        return this.state.isStarted ? (<Paper style={ style }><Typography style={{ margin: '0px 5px' }} color='textSecondary'>Time remaining:</Typography><div style={{ width: '75%', margin: '0 auto' }}><Counter date={this.state.startTime + this.state.timeLeft*PRODUCTION_SECONDS} renderer={renderer}/></div></Paper>) : <Paper style={ style }>Please wait until the game starts</Paper>;
    }
}
export default withFirebase(Countdown);