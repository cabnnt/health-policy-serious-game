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

const styles = NavigationStyles;

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
    
    const { authUser } = this.props;
    const showAdmin = authUser.role === 'teacher';
    const gamesListLabel = showAdmin ? 'Current games' : 'Join game';

    this.menuTabs = [
      { label: gamesListLabel, pathnames: ['/home', '/'] },
      { label: 'Current Game', pathnames: ['/game'] },
      { label: 'Account', pathnames: ['/account'] },
      { label: 'Sign Out', pathnames: ['/signout'] }
    ]

    if (showAdmin) {
      this.menuTabs.unshift({ label: 'Create game', pathnames: ['/admin'] })
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  current = () => {
    const currentPath = this.props.location.pathname;
    return this.menuTabs.findIndex(tab => {
      return tab ? tab.pathnames.includes(currentPath) : false;
    });
  }

  render() {
    const { classes } = this.props;
    const { authUser } = this.props;

    return (
      authUser ?
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
                        this.menuTabs.map((tab, index) => {
                          const pathname = tab.pathnames[0];
                          return <Tab
                            key={ index }
                            component={ Link }
                            to={
                              pathname.match(new RegExp(/(game)/))
                                ? `${pathname}?gameId=${authUser.currentGame}`
                                : pathname
                            }
                            classes={{ root: classes.tabItem }}
                            label={ tab.label } 
                          />
                        })
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
