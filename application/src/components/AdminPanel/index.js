import React from 'react';
import NumberFormat from 'react-number-format';
import { withFirebase } from '../Firebase';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import numeral from 'numeral'
import Paper from '@material-ui/core/Paper';

const INITIAL_STATE = {
  timeRemaining: null,
  name: "",
  endTime: null,
  gameId: null,
  gamePending: false,
  time : 0,
  minorCost:null,
  majorCost:null
}
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing.unit,
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
    }
    handlePriceChange = (event)=>{
      event.persist();
      
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
    onDoctorChange = (event)=>{
      this.setState({numberOfDoctors: event.target.value})
    }
    render() {
      const { classes } = this.props;
      return (
        <Paper className={classes.root}>
          <FormControl className={classes.formControl}>
            <InputLabel style={{marginLeft:10, marginTop:10}}>Round-Time</InputLabel>
            <Select
              style={{marginLeft:10}}
              value={this.state.time}
              onChange={this.handleMenuChange}
              inputProps={
                {
                  name: 'time',
                  id: 'time-simple',
                }
              }
            >
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={45}>45 minutes</MenuItem>
              <MenuItem value={60}>60 minutes</MenuItem>
              <MenuItem value={75}>75 minutes</MenuItem>
              <MenuItem value={90}>90 minutes</MenuItem>
            </Select>
            <TextField
                style={{marginTop:0}}
                id="outlined-name"
                label="Name of Game"
                className={classes.textField}
                value={this.state.name}
                onChange={(this.handleNameChange)}
                margin="normal"
                variant="standard"
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
            <NumberFormat 
              label="Minor Treatment Cost"
              hinttext="Minor Treatment Cost" 
              value={this.state.minorCost}
              decimalScale={2}
              mask={'_'}
              fixedDecimalScale={true} 
              customInput={TextField} 
              className= {classes.textField} 
              thousandSeparator={true} prefix={'$'}
              onChange={(e)=>this.setState({minorCost:e.target.value})}
              inputMode="number"/>
            <NumberFormat 
              label="Major Treatment Cost"
              hinttext="Major Treatment Cost" 
              value={this.state.majorCost}
              decimalScale={2}
              mask={'_'}
              fixedDecimalScale={true} 
              customInput={TextField} 
              className= {classes.textField} 
              thousandSeparator={true}
              prefix={'$'}
              onChange={(e)=>this.setState({majorCost:e.target.value})}
              inputMode="number"/>
            <Button
              type="submit"
              onClick={ this.onSubmit }
              disabled={ !!this.state.gameId || this.state.time==0 || this.state.minorCost>this.state.majorCost}
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
      </Paper>
      )
    }
    onSubmit = async (event) => {
      const { firebase } = this.props;
      let params = {
        name: this.state.name,
        roundTime: this.state.time,
        numberOfDoctors: this.state.numberOfDoctors,
        minorCost : numeral(this.state.minorCost).value(),
        majorCost : numeral(this.state.majorCost).value()
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
