import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const EventOutcomes = (props) => {
  return (
    <>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {'Rozliczenie imprezy'}
    </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>LP</TableCell>
            <TableCell>NR faktury</TableCell>
            <TableCell>Sposób finansowania</TableCell>
            <TableCell>Kategoria wydatku</TableCell>
            <TableCell>Jednostka</TableCell>
            <TableCell>Kod imprezy (automatycznie)</TableCell>
            <TableCell align="right">Pełny tytuł</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows && props.rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.shipTo}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default EventOutcomes;
