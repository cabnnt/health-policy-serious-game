import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import { withFirebase } from '../../Firebase';
import numeral from 'numeral';

const INITIAL_STATE = {
  minorTreatmentPrice: 0.00,
  majorTreatmentPrice: 0.00,
  updatedSinceLastPatient: false,
}

class PriceUpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    }
  }

  componentDidMount() {
    const { doctor } = this.props;

    if (doctor) {
      const { minorTreatmentPrice, majorTreatmentPrice, updatedSinceLastPatient } = doctor.prices || INITIAL_STATE;
      this.setState({
        minorTreatmentPrice: numeral(minorTreatmentPrice).format('$0,0.00'),
        majorTreatmentPrice: numeral(majorTreatmentPrice).format('$0,0.00'),
        updatedSinceLastPatient
      });
    }
  }

  onSubmit() {
    const { doctor, gameId } = this.props;

    if (doctor) {
      const firestore = this.props.firebase.db;
      const doctorReference = firestore
        .collection('games')
        .doc(gameId)
        .collection('doctors')
        .doc(doctor.id);
      
      firestore
        .runTransaction(transaction => {
          return transaction
            .get(doctorReference)
            .then(doctorDocument => {
              const { minorTreatmentPrice, majorTreatmentPrice } = this.state;
              this.setState({
                updatedSinceLastPatient: true,
              });

              if (doctorDocument.exists) {
                transaction.set(
                  doctorReference,
                  {
                    prices: {
                      minorTreatmentPrice: numeral(minorTreatmentPrice).value(),
                      majorTreatmentPrice: numeral(majorTreatmentPrice).value(),
                      updatedSinceLastPatient: true,
                    }
                  },
                  { merge: true }
                )
              }
            })
        })
    }
  }
  
  render() {
    const { updatedSinceLastPatient, majorTreatmentPrice, minorTreatmentPrice } = this.state;

    return(
      <Paper>
        <FormControl>
          <NumberFormat 
            label="Minor treatment price"
            hinttext="Minor treatment price" 
            value={ minorTreatmentPrice }
            decimalScale={2}
            mask={'_'}
            fixedDecimalScale={true}
            customInput={TextField} 
            thousandSeparator={true} prefix={'$'}
            onChange={(e)=>this.setState({minorTreatmentPrice:e.target.value})}
            inputMode="number"/>
          <NumberFormat 
            label="Major treatment price"
            hinttext="Major treatment price" 
            value={ majorTreatmentPrice }
            decimalScale={2}
            mask={'_'}
            fixedDecimalScale={true} 
            customInput={TextField} 
            thousandSeparator={true}
            prefix={'$'}
            onChange={(e)=>this.setState({majorTreatmentPrice:e.target.value})}
            inputMode="number"/>
          <Button
            type="submit"
            onClick={ this.onSubmit.bind(this) }
            disabled={ updatedSinceLastPatient || minorTreatmentPrice > majorTreatmentPrice}
          >
            {
              !updatedSinceLastPatient
                ? 'Update prices'
                : 'Prices updated'
            }
          </Button>
        </FormControl>
      </Paper>
    )
  }
}

PriceUpdateForm.propTypes = {
  gameId: PropTypes.string.isRequired,
  doctor: PropTypes.object.isRequired,
}

export default withFirebase(PriceUpdateForm);
