import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import { withAuthorization } from '../Authorization/context';
import SimplePopperStyles from '../../styles/simplePopperStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Queue from '../Queue';

const doctorStyles = SimplePopperStyles;
const styles = theme => ({
  typography: {
    padding: theme.spacing.unit * 2,
  },
});


class SimplePopper extends React.Component {
  constructor(props){
    super(props);
    this.name = props.name;
  }

  state = {
    anchorEl: null,
    open: false,
    inQueue: false
  };

  // handleClick = event => {
  //   const { currentTarget } = event;
  //   this.setState(state => ({
  //     anchorEl: currentTarget,
  //     open: !state.open,
  //   }));
  // };


  handleClick = event => {
    if(window.confirm("Would you like to join this queue?")) {
      const { name } = this.props;
      this.props.onClickJoinQueue(name);
      this.setState(state => ({
      open: !state.open,
      }));
    }
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, open } = this.state;
    const id = open ? 'simple-popper' : null;


    return (
      
      <div>
        
        <Button className={classes.DoctorButton} aria-describedby={id} variant="contained" onClick={this.handleClick}>
          {this.props.name} <br />Band-Aid: $4 / Stitches: $10
        </Button>

          { 
            this.props.renderQueue ? <Queue /> : null
          }    
      </div>
    );
  }
}


{/* <Button className={classes.DoctorButton} aria-describedby={id} variant="contained" onClick={this.handleClick}>
          Doctor {this.props.name}
        </Button>
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography className={classes.typography}>
                  Minor Treatment : $4 / Major Treatment $10
                  <Button onClick={this.handleClickJoinQueue}>Join Queue</Button>
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper> */}

SimplePopper.propTypes = {
  classes: PropTypes.object.isRequired,
};
////export default withStyles(styles)(SimplePopper);
export default withAuthorization(withStyles(styles)(SimplePopper));