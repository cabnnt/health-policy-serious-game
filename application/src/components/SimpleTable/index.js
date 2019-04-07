import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '90%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function SimpleTable(props) {
  const { classes, collection, attributes, headers } = props;

  return (
    <Paper className={ classes.root }>
      <Table className={ classes.table }>
        <TableHead>
          <TableRow>
            { 
              attributes.map((attribute, index) => {
                return (
                  index === 0
                    ? <TableCell key={ `${attribute}-header` }>{ headers[attribute] }</TableCell>
                    : <TableCell align='right'>{ headers[attribute] }</TableCell>
                );
              })
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {
            collection.map(row => (
              <TableRow key={ row.id }>
                {
                  attributes.map((attribute, index) => {
                    return (
                      index === 0
                        ? <TableCell
                            key={ row[attribute] }
                            component='th'
                            scope='row'>
                            { row[attribute] }
                          </TableCell>
                        : <TableCell align='right'>{ row[attribute] }</TableCell>
                    );
                  })
                }
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(SimpleTable);
