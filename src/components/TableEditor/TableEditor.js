import React, {useEffect, useState} from 'react'

/* TODO Use MUI Table and TextInput to implement outcome editor 
1. Method to render data with name, surname, event, invoice number, value, founding system and category
2. Methods to edit
3. Method to filter diplaying info.
4. Use this component in application
*/
import CircularProgress from '@material-ui/core/CircularProgress';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { TextField, MenuItem } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';

const TableEditor = (props) => {
  return (
    <div>
    {props.save && <>
      <Alert severity="warning">Niezapisane zmiany zostaną utracone!</Alert>
      <Button variant="contained" color="primary" onClick={() => props.saveHandler()}>Zapisz zmiany do bazy</Button>
      </>}
  <Typography component="h2" variant="h6" color="primary" gutterBottom>
  {`Lista ${props.info === 'income' ? 'przychodów' : 'kosztów'} do edycji:`}
</Typography>
  {props.data ? <Table size="medium">
    <TableHead>
      <TableRow>
        <TableCell>LP</TableCell>
        <TableCell>Tytuł</TableCell>
        <TableCell>Kwota</TableCell>
        {props.info !== 'income' && <TableCell>Nr faktury</TableCell>}
        <TableCell>Drużyna</TableCell>
        {props.info !== 'outcome' && <TableCell>Imię</TableCell>}
        {props.info !== 'outcome' && <TableCell>Nazwisko</TableCell>}
        <TableCell>Wydarzenie</TableCell>
        {props.info !== 'income' && <TableCell>Źródło finansowania</TableCell>}
        {props.info !== 'income' && <TableCell>Kategoria kosztów</TableCell>}
      </TableRow>
    </TableHead>
    <TableBody>
      {props.data.map((position, index) => (
        <TableRow key={index} 
          data-team={position.team} 
          data-event={position.event} 
          data-founding={position.foundingSource} 
          data-category={position.outcomeCategory}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell>{position.title}</TableCell>
          <TableCell>
            {position.cash}
            </TableCell>
            {props.info !== 'income' && <TableCell>
          <TextField
              size='medium'
              value={position.bilingNr}
              margin='dense'
              onChange={(e) => props.onChange(index, 'bilingNr', e.target.value)}
            />
            </TableCell>}
          <TableCell data-info='team'>
          <TextField
              size='medium'
              value={position.team}
              margin='dense'
              onChange={(e) => props.onChange(index, 'team', e.target.value)}
              select={true}
              SelectProps={{
                MenuProps: { disableScrollLock: true }
              }}
            >
              {props.additionalData.teams.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
          </TextField>
            </TableCell>

            {props.info !== 'outcome' && <TableCell>
          <TextField
              size='medium'
              value={position.name}
              margin='dense'
              onChange={(e) => props.onChange(index, 'name', e.target.value)}
            />
            </TableCell>}
          {props.info !== 'outcome' &&  <TableCell>
          <TextField
              size='medium'
              value={position.surname}
              margin='dense'
              onChange={(e) => props.onChange(index, 'surname', e.target.value)}
            />
            </TableCell>}
          <TableCell>
          <TextField
              size='medium'
              value={position.event}
              margin='dense'
              onChange={(e) => props.onChange(index, 'event', e.target.value)}
              select={true}
              SelectProps={{
                MenuProps: { disableScrollLock: true }
              }}
            >
              {props.additionalData.codes.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
          </TextField>
            </TableCell>

            {props.info !== 'income' && <TableCell>
          <TextField
              size='medium'
              value={position.foundingSource}
              margin='dense'
              onChange={(e) => props.onChange(index, 'foundingSource', e.target.value)}
              select={true}
              SelectProps={{
                MenuProps: { disableScrollLock: true }
              }}
            >
              {props.additionalData.foundingSources.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
          </TextField>
            </TableCell>}
            {props.info !== 'income' && <TableCell>
          <TextField
              size='medium'
              value={position.outcomeCategory}
              margin='dense'
              onChange={(e) => props.onChange(index, 'outcomeCategory', e.target.value)}
              select={true}
              SelectProps={{
                MenuProps: { disableScrollLock: true }
              }}
            >
              {props.additionalData.outcomeCategory.map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
          </TextField>
            </TableCell>}
        </TableRow>
      ))}
    </TableBody>
  </Table> : <div className="loader"><CircularProgress/></div>}
    </div>
  )
}

export default TableEditor
