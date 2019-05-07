import illmatic from '../../js/stringGen'
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
