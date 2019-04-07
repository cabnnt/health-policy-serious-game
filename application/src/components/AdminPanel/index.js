import TimeInput from 'material-ui-time-picker';
import React from 'react';
import { min } from 'moment';
const moment = require('moment');
export default class AdminPanel extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
      return <div>
          <h2>AdminPanel</h2>
          <TimeInput mode='12h' onChange={(time)=> this.handleChange(time)}/>
          <div>{this.state.time_remaining}</div>
      </div>
    }
    handleChange(params) {
      let now = moment();
      let till = moment(params);
      console.log(`The moment now is : ${now}`);
      console.log(`The moment till is : ${till}`);
      var duration = moment.duration(till.diff(now));
      var minutes = duration.asMinutes();
      console.log(duration);
      console.log(minutes);
      this.setState({time_remaining: minutes});
      
    }
  }