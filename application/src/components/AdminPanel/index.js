import TimeInput from 'material-ui-time-picker';
import React from 'react';

import { min } from 'moment';
import { withFirebase } from '../Firebase';
import FormStyles from '../../styles/formStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

const moment = require('moment');
const INITIAL_STATE = {
  timeRemaining: null,
  endTime: null,
  gameId: null,
  gamePending: false
}
const styles = FormStyles;

class AdminPanel extends React.Component{
    constructor(props){
      super(props);
      this.state = { ...INITIAL_STATE };
    }

    render() {
      const { classes } = this.props;
      
      return (
        <main className={ classes.main }>
          <TimeInput mode='12h' onChange={ time => this.handleChange(time) }/>
          { 
            this.state.timeRemaining && this.state.timeRemaining >= 0
              ? <div>Time for round: { this.state.timeRemaining }</div>
              : <div>Please enter a valid time</div>
          }
          <Button
            type="submit"
            onClick={ this.onSubmit }
            disabled={ !!this.state.gameId }>
            {
              this.state.gameId 
                ? 'Game created'
                : (this.state.gamePending
                  ? 'Creating game...'
                  : 'Create new game')
            }
          </Button>
        </main>
      )
    }
    
    onSubmit = async (event) => {
      const { firebase } = this.props;
      this.setState({ gamePending: true });
      this.setState({ gameId: (await firebase.createGame()).id } );
      this.setState({ gamePending: false });
    }

    handleChange(params) {
      let now = moment();
      let till = moment(params);
      var duration = moment.duration(till.diff(now));
      var minutes = Math.round(duration.asMinutes())
      this.setState({endTime: till, timeRemaining: minutes});
      
    }
  }

export default withFirebase(withStyles(styles)(AdminPanel));
