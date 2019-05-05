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
import { withFirebase } from '../Firebase';

import 'firebase/firestore';
import { firestore } from 'firebase';

//import JoinGameButton from '../JoinGameButton';


const styles = NavigationStyles;

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };

    this.listener = null;
    const { authUser } = this.props;
    const showAdmin = authUser.role === 'teacher';
    const gamesListLabel = showAdmin ? 'Current games' : 'Join game';
   
   
    this.state = {
      inGame:false,
      firstGameJoined:false

    }
    
    this.menuTabs = [
      { label: gamesListLabel, pathnames: ['/home', '/'] },
      { label: 'Account', pathnames: ['/account'] },
      { label: 'Sign Out', pathnames: ['/signout'] }
    ]


    if (showAdmin) {
      this.menuTabs.unshift({ label: 'Create game', pathnames: ['/admin'] })
    }
  }


  componentDidMount() {
  
    if(this.props.authUser && !this.props.firstGameJoined){
      
      const firestore = this.props.firebase.db; // this is our "firestore"
      this.listener = firestore
      .collection('users')
      .doc(this.props.authUser.id) // you'll need to specify what is to be listened to in the DB
      .onSnapshot(userDocument =>
        {
          const { currentGame } = userDocument.data(); // remember you're interacting with the DB here
          
          if(this.props.authUser.currentGame) {
            this.setState({inGame: true});
            this.setState({firstGameJoined: true});
            
           
          }
         
          //this.setState({ inGame: !!currentGame });
        });
    }
  
  }

  componentWillUnmount() {
    this.listener && this.listener();
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
    const { inGame } = this.state;
    const { firstGameJoined } = this.state;
    const { classes } = this.props;
    const { authUser } = this.props;


    if (inGame && !firstGameJoined) {
      this.menuTabs.unshift({ label: 'Current Game', pathnames: ['/game'] })
      this.setState({inGame: false});
    }
   

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
                                ? (authUser.currentGame
                                  ? `${pathname}?gameId=${authUser.currentGame}`     
                                  : `${pathname}` 
                                )
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
//export default withAuthorization(withFirebase(Navigation));
export default withRouter(withFirebase(withAuthorization(withStyles(styles)(Navigation))));
