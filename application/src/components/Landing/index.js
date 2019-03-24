import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  signingIn: false,
  email: '',
  password: '',
  error: null
};

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidUpdate() {
    if (this.state.signingIn) {
      this.setState({ ...INITIAL_STATE });
    }
  }

  onSubmit = event => {
    const { email, password } = this.state;
    event.preventDefault();

    this.props.firebase
      .signIn(email, password)
      .then(() => {
        this.setState({ signingIn: true });
      }).catch(error => {
        this.setState({ error });
      });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const classes = this.props.classes;
    const { email, password, error } = this.state;
    const isInvalid = (
      password === '' || email === ''
    );

    return(
      this.state.signingIn
        ? <Redirect to={ ROUTES.HOME } />
        : <main className={ classes.main }>
            <Paper className={ classes.paper }>
              <Avatar className={ classes.avatar }>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <form onSubmit={ this.onSubmit } className={ classes.form }>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">
                    Email Address
                  </InputLabel>
                  <Input
                    id="email"
                    name="email"
                    value={ email }
                    onChange={ this.onChange }
                    autoFocus
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">
                    Password
                  </InputLabel>
                  <Input
                    id="password"
                    name="password"
                    value={ password }
                    onChange={ this.onChange }
                    type="password"
                  />
                </FormControl>
                <Button
                  disabled={ isInvalid }
                  type="submit"
                  onClick={ this.onSubmit }
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={ classes.submit }
                >
                  Sign in
                </Button>
                <Typography color="textSecondary" variant="caption">
                  Not registered? <Link to={ ROUTES.SIGN_UP }>Create an account.</Link>
                </Typography>
              </form>
              { error &&
                  <Typography 
                    color="error"
                    variant="body2">
                    <br />{ error.message }
                  </Typography> }
            </Paper>
          </main>
    )
  }
}

export default withRouter(withFirebase(withStyles(styles)(Landing)));
