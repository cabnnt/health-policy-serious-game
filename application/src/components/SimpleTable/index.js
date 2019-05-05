import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AuthorizedGameButtons from '../GameButtons/AuthorizedGameButtons';

const styles = theme => ({
  root: {
    width: '90%',
    marginTop: theme.spacing.unit,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const SimpleTable = props => {
  const { classes, collection, attributes, headers } = props;

  return(
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
            <TableCell />
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
                            scope='row'
                          >
                            { row[attribute] }
                          </TableCell>
                        : <TableCell>{ row[attribute] }</TableCell>
                    );
                  })
                }
                <TableCell>
                  <AuthorizedGameButtons gameId={ row.id } />
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </Paper>
  )
}

export default withStyles(styles)(SimpleTable);
