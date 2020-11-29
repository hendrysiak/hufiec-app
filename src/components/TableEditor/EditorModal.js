import React, {useEffect, useState} from 'react'

import Modal from '@material-ui/core/Modal';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import { TextField, MenuItem } from '@material-ui/core';

const EditorModal = (props) => {


  const modalBody = props.position ? (<Modal 
    open={props.modalVisible}  
    onClose={() => props.setModalVisible(false)}
  >
    <Paper className="modal__paper">
    <div className="modal">
    <Table size="medium">
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
          {props.info !== 'income' && <TableCell>Źródło wpływu</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
      <TableRow>
      <TableCell>{props.index + 1}</TableCell>
      {!props.add 
        ? (<><TableCell>{props.position.title}</TableCell>
          <TableCell>{props.position.cash}</TableCell></>)
        : (<><TableCell>
          <TextField
            size='medium'
            value={props.position.title}
            margin='dense'
            onChange={(e) => props.onChange(props.index, 'title', e.target.value)}
          />
          </TableCell>
          <TableCell>
          <TextField
            size='medium'
            value={props.position.cash}
            margin='dense'
            onChange={(e) => props.onChange(props.index, 'cash', e.target.value)}
          />
          </TableCell>
          </>)
      }
        {props.info !== 'income' && <TableCell>
      <TextField
          size='medium'
          value={props.position.bilingNr}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'bilingNr', e.target.value)}
        />
        </TableCell>}
      <TableCell data-info='team'>
      <TextField
          size='medium'
          value={props.position.team}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'team', e.target.value)}
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
          value={props.position.name}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'name', e.target.value)}
        />
        </TableCell>}
      {props.info !== 'outcome' &&  <TableCell>
      <TextField
          size='medium'
          value={props.position.surname}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'surname', e.target.value)}
        />
        </TableCell>}
      <TableCell>
      <TextField
          size='medium'
          value={props.position.event}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'event', e.target.value)}
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
          value={props.position.foundingSource}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'foundingSource', e.target.value)}
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
          value={props.position.outcomeCategory}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'outcomeCategory', e.target.value)}
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
        {props.info !== 'income' && <TableCell>
      <TextField
          size='medium'
          value={props.position.financeMethod}
          margin='dense'
          onChange={(e) => props.onChange(props.index, 'financeMethod', e.target.value)}
          select={true}
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {['transfer', 'cash'].map((item) => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
      </TextField>
        </TableCell>}
    </TableRow>
      </TableBody>
    </Table>
    <Button variant="contained" color="primary" onClick={() => {
      props.setModalVisible(false);
      if (props.add) props.setAddingNewPosition(false)
      }}>{props.add ? 'Dodaj nową pozycję' : 'Zakończ edycję'}</Button>
    </div>
    </Paper>
          
  </Modal>) : <></>

  return (<>{modalBody}</>)
}

export default EditorModal;