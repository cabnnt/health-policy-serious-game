import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import PropTypes, { string } from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

const CERTAINTIES = [
  'Completely uncertain',
  'Very uncertain',
  'Somewhat uncertain',
  'Not sure',
  'Somewhat certain',
  'Very certain',
  'Completely certain',
];
const SEVERITIES = [
  'Not severe at all',
  'Somewhat severe',
  'Concerningly severe',
  'Very severe',
  'Dangerously severe',
]
const TREATMENTS = [
  'No treatment',
  'Minor treatment',
  'Major treatment',
  'Either treatment',
]
const CHOICES = {
  certainty: CERTAINTIES,
  severity: SEVERITIES,
  treatment: TREATMENTS,
}

class RecommendationPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certainty: '3',
      severity: '2',
      treatment: '0',
      useRow: true,
    }
  }

  handleChange = event => {
    const { onSelectionChange } = this.props;
    const diagnosis = { ...Object.assign(
      this.state,
      { [event.target.name]: event.target.value }
    )};
    
    Object.keys(diagnosis)
      .filter(k => !['certainty', 'severity', 'treatment'].includes(k))
      .forEach(k => {
        delete diagnosis[k];
      })
    Object.keys(diagnosis)
      .forEach(k => {
        diagnosis[k] = parseInt(diagnosis[k]);
      })
    
    this.setState({ [event.target.name]: event.target.value });
    onSelectionChange({
      certainty: CERTAINTIES[diagnosis.certainty],
      severity: SEVERITIES[diagnosis.severity],
      treatment: TREATMENTS[diagnosis.treatment],
    });
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth.bind(this));
  }

  updateWidth() {
    this.setState({ useRow: window.innerWidth > 1100 });
  }

  render() {
    const { useRow } = this.state;
    
    return(
      <Paper style={{ margin: 10 }}>
        <FormControl component='fieldset'>
          {
            ['certainty', 'severity', 'treatment'].map(attribute => 
              {
                const attributeLabel = attribute.charAt(0).toUpperCase() + attribute.slice(1);
                return(<div key={ `${attribute}-div` }>
                  <FormLabel
                    key={`${attribute}-label`}
                    component='legend'
                    style={{ margin: 5 }}
                  >
                    { attributeLabel }
                  </FormLabel>
                  <RadioGroup
                    key={`${attribute}-radio-group`}
                    row={ useRow }
                    style={{ margin: 5, display: 'flex', width: 'auto' }}
                    name={ attribute }
                    value={ this.state[attribute] }
                    onChange={ this.handleChange }
                  >
                    {
                      CHOICES[attribute].map((label, index) => {
                        return(<FormControlLabel
                          key={ index }
                          value={ index.toString() }
                          control={ <Radio /> }
                          label={ label }
                        />)
                      })
                    }
                  </RadioGroup>
                </div>)
              }
            )
          }
        </FormControl>
      </Paper>
    )
  }
}

RecommendationPanel.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default RecommendationPanel;

