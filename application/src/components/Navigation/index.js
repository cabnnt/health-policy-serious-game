import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const Menu = [
  {
    label: "Home",
    pathname: "/home"
  },
  {
    label: "Account",
    pathname: "/account"
  },
  {
    label: "Sign out",
    pathname: "/signout"
  }
];

const styles = theme => ({
  appBar: {
    position: 'relative',
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.grey['100']}`,
    backgroundColor: 'white',

  },
  inline: {
    display: 'inline'
  },
  flex: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    }
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  tagline: {
    display: 'inline-block',
    marginLeft: 10,
    [theme.breakpoints.up('md')]: {
      paddingTop: '0.8em'
    }
  },
  iconContainer: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block'
    }
  },
  iconButton: {
    float: 'right'
  },
  tabContainer: {
    marginLeft: 32,
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: 'auto'
  }
})

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  current = () => {
    const currentPath = this.props.location.pathname;

    switch (currentPath) {
      case "/":
      case "/home":
        return 0;
        break;
      case "/account":
        return 1;
        break;
      case "/signout":
        return 2;
        break;
    }
  }

  render() {
    const { classes } = this.props;

    return (
      this.props.authUser ?
        <AppBar position="absolute" color="default" className={ classes.appBar }>
          <Toolbar>
              <Grid container spacing={ 24 } alignItems="baseline">
                <Grid item xs={ 12 } className={ classes.flex }>
                    <div className={ classes.inline }>
                      <Typography variant="h6" color="inherit" noWrap>
                        <Link to='/' className={ classes.link }>
                          <span className={ classes.tagline }>Health Policy</span>
                        </Link>
                      </Typography>
                    </div>
                    <div className={ classes.tabContainer }>
                      <Tabs
                        value={ this.current() || this.state.value }
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={ this.handleChange }
                      >
                        {
                          Menu.map((item, index) => (
                            <Tab
                              key={ index }
                              component={ Link }
                              to={{ pathname: item.pathname }}
                              classes={{ root: classes.tabItem }}
                              label={ item.label } 
                            />
                          ))
                        }
                      </Tabs>
                    </div>
                </Grid>
              </Grid>
          </Toolbar>
        </AppBar> : null
    )
  }
}

export default withRouter(withStyles(styles)(Navigation))