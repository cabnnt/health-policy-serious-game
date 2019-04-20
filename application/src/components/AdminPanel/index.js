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
  name: "",
  endTime: null,
  gameId: null,
  gamePending: false,
  time : 0,
  minorCost: 5.80,
  majorCost: 585.10
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
    handlePriceChange = (event)=>{
      event.persist();
      console.log(event);
      this.setState({
        minorCost: event.target.value,
        majorCost: event.target.value
      })
    }
    handleMenuChange = (event)=>{
      event.persist();
      this.setState({time: event.target.value}) // todo 
    }
    handleNameChange = (event)=>{
      event.persist();
      this.setState({name:event.target.value});
      
    }
    onDateChange = (event)=>{
      event.persist();
      this.setState({startTime: event.target.value})
    }
    onDoctorChange = (event)=>{
      console.log("docto chang");
      this.setState({numberOfDoctors: event.target.value})
    }
    render() {
      const { classes } = this.props;
      const { firebase } = this.props;
      return (
        <div>
        
        <FormControl className={classes.formControl}>
          <TextField
              id="outlined-name"
              label="Name of Game"
              className={classes.textField}
              value={this.state.name}
              onChange={this.handleNameChange}
              margin="normal"
              variant="standard"
          />
          <Select
            value={this.state.time}
            onChange={this.handleMenuChange}
            inputProps={{
              name: 'time',
              id: 'time-simple',
            }}
          >
          {/* <InputLabel htmlFor="time-simple">Time for Round</InputLabel> */}
          <MenuItem value="0">
            <em>Round Time </em>
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
            <TextField
              id="number"
              label="Number of Doctors"
              type="number"
              defaultValue={this.state.numberOfDoctors}
              className={classes.textField}
              inputProps={{min:0, max: Number.MAX_SAFE_INTEGER}}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={this.onDoctorChange}
            />
            <TextField
              id="standard-number"
              label="Minor Treatment Cost"
              defaultValue={this.state.minorCost}
              onChange={this.handlePriceChange}
              type="number"
              inputProps={{step:0.10, min:0.00, max: Number.MAX_SAFE_INTEGER}}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              id="standard-number"
              label="Major Treatment Cost"
              defaultValue={this.state.majorCost}
              onChange={this.handlePriceChange}
              type="number"
              inputProps={{step:0.10, min:0.00, max: Number.MAX_SAFE_INTEGER}}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <Button
              type="submit"
              onClick={ this.onSubmit }
              disabled={ !!this.state.gameId || this.state.time==0 || moment(this.state.startTime) < moment() || this.state.minorCost>this.state.majorCost}
              >
              {
                this.state.gameId 
                ? 'Game created'
                : (this.state.gamePending
                  ? 'Creating game...'
                  : 'Create new game')
                }
            </Button>
            {
              moment(this.state.startTime) < moment() ? <div> Sorry the start time is in the past - we can't do that</div> : <div></div>
            }
          </FormControl>
      </div>
      )
    }
    onSubmit = async (event) => {
      const { firebase } = this.props;
      let params = {
        name: this.state.name,
        startTime: moment(this.state.startTime).format("YYYY-MM-DDThh:mm"),
        roundTime: this.state.time,
        numberOfDoctors: this.state.numberOfDoctors,
        minorCost : this.state.minorCost,
        majorCost : this.state.majorCost
      }
      this.setState({ gamePending: true });
      this.setState({ gameId: (await firebase.createGame(params)).id } );
      this.setState({ gamePending: false });
    }

    handleChange = event=>{
      this.setState({ [event.target.name]: event.target.value });
  }
}

export default withFirebase(withStyles(styles)(AdminPanel));
