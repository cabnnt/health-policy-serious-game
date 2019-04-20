import TimeInput from 'material-ui-time-picker';
import React from 'react';

import { min } from 'moment';
import { withFirebase } from '../Firebase';
import FormStyles from '../../styles/formStyles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
const moment = require('moment');
const INITIAL_STATE = {
  timeRemaining: null,
  endTime: null,
  gameId: null,
  gamePending: false,
  time : 0,
}
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});;

class AdminPanel extends React.Component{
  constructor(props){
    super(props);
    
      this.state = { ...INITIAL_STATE };
      this.handleMenuChange = this.handleMenuChange.bind(this);
      this.onDateChange = this.onDateChange.bind(this);
    }
    handleMenuChange = (event)=>{
      this.setState({time: event.target.value}) // todo 
    }
    onDateChange = (event)=>{
      event.persist();
      this.setState({startTime: event.target.value})
    }
    render() {
      const { classes } = this.props;
      const { firebase } = this.props;
      return (
        <div>
          {
            moment(this.state.startTime) < moment() ? <div> Sorry the start time is in the past - we can't do that</div> : <div></div>
          }
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="time-simple">Time for Round</InputLabel>
            <Select
              value={this.state.time}
              onChange={this.handleMenuChange}
              inputProps={{
                name: 'time',
                id: 'time-simple',
              }}
            >
              <MenuItem value="0">
                <em>Choose one: </em>
              </MenuItem>
              {/* TODO : Enumerate and loop */}
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>60 minutes</MenuItem>
                <MenuItem value={75}>75 minutes</MenuItem>
                <MenuItem value={90}>90 minutes</MenuItem>
            </Select>
            <TextField
              id="datetime-local"
              label="Round Start Time"
              type="datetime-local"
              defaultValue={moment().format("YYYY-MM-DDThh:mm")}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.onDateChange}
            />
            
            <Button
              type="submit"
              onClick={ this.onSubmit }
              disabled={ !!this.state.gameId || !this.state.time || moment(this.state.startTime) < moment()}
              >
              {
                this.state.gameId 
                ? 'Game created'
                : (this.state.gamePending
                  ? 'Creating game...'
                  : 'Create new game')
                }
            </Button>
          </FormControl>
        </form>
      </div>
      )
    }
    onSubmit = async (event) => {
      const { firebase } = this.props;
      this.setState({ gamePending: true });
      this.setState({ gameId: (await firebase.createGame()).id } );
      this.setState({ gamePending: false });
    }

    handleChange = event=>{
      this.setState({ [event.target.name]: event.target.value });
  }
}

export default withFirebase(withStyles(styles)(AdminPanel));
