import React, { Component } from 'react';
import SimplePopper from '../SimplePopper';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  doctor: {
    display: 'inline-block',
    margin: 10,
    color:"red",
    backgroundColor:"blue",
  }
}

class QueueList extends Component {
  constructor(props) {
    super(props);

    const doctors = [
      {
        id: 'abc123def456',
        username: 'doctor0',
        email: 'doctor0@example.com'
      },
      {
        id: 'abc123def789',
        username: 'doctor1',
        email: 'doctor1@example.com'
      }
    ];

    this.state = {
      queues: doctors.map(
        doctor => { return { id: doctor.username } }
      ),
      renderedQueue: null,
    };
  }

  onClickJoinQueue(name) {
    this.setState({ renderedQueue: name });

  }


  render() {
    const { classes } = this.props;
    const { queues } = this.state;
  
   return(
      queues.map(
        ((queue, index) => {
          return <SimplePopper
            className={ classes.doctor }
            key={ queue.id }
            name={ queue.id }
            renderQueue={ this.state.renderedQueue === queue.id }
            onClickJoinQueue={ this.onClickJoinQueue.bind(this, queue.id)} />;
        
        
          })
      )
    );
    
  }
 
}

export default withStyles(styles)(QueueList);
