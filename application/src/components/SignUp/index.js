import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FaceOutlinedIcon from '@material-ui/icons/FaceOutlined';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import FormStyles from '../../styles/formStyles';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const styles = FormStyles;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    event.preventDefault();

    this.props.firebase
      .createUser(username, email, passwordOne)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const classes = this.props.classes;
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error
    } = this.state;
    const isInvalid = (
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === ''
    );

    return (
      <main className={ classes.main }>
        <Paper className={ classes.paper }>
          <Avatar className={ classes.avatar }>
            <FaceOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create account
          </Typography>
          <form onSubmit={ this.onSubmit } className={ classes.form }>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">
                Username
              </InputLabel>
              <Input
                id="username"
                name="username"
                value={ username }
                onChange={ this.onChange }
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">
                Email address
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
              <InputLabel htmlFor="passwordOne">
                Password
              </InputLabel>
              <Input
                id="passwordOne"
                name="passwordOne"
                value={ passwordOne }
                onChange={ this.onChange }
                type="password"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwordTwo">
                Confirm password
              </InputLabel>
              <Input
                id="passwordTwo"
                name="passwordTwo"
                value={ passwordTwo }
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
              Create account
            </Button>
            <Typography color="textSecondary" variant="caption">
              <br />Already registered? <Link to={ ROUTES.SIGN_IN }>Sign in.</Link>
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
    );
  }
}

export default withRouter(withFirebase(withStyles(styles)(SignUp)));
