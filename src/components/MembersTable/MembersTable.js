import React from 'react'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

const MembersTable = (props) => {
  return (
    <div>
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
  {'Lista członków drużyny (stan z SEH):'}
</Typography>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>LP</TableCell>
        <TableCell>Imię</TableCell>
        <TableCell>Nazwisko</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {props.members && props.members.map((member, index) => (
        <TableRow key={index}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{member.name}</TableCell>
          <TableCell>{member.surname}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
    </div>
  )
}

export default MembersTable;
