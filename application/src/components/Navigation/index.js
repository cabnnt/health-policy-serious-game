import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import NavigationStyles from '../../styles/navigationStyles';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withAuthorization } from '../Authorization/context';
import withStyles from '@material-ui/core/styles/withStyles';

const MenuTabs = [
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

const styles = NavigationStyles;

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
      case "/account":
        return 1;
      case "/signout":
        return 2;
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
                          MenuTabs.map((item, index) => (
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

export default withRouter(withAuthorization(withStyles(styles)(Navigation)));
