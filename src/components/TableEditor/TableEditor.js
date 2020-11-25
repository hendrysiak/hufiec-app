import React, {useEffect, useState} from 'react'

/* TODO Use MUI Table and TextInput to implement outcome editor 
1. Method to render data with name, surname, event, invoice number, value, founding system and category
2. Methods to edit
3. Method to filter diplaying info.
4. Use this component in application
*/
import CircularProgress from '@material-ui/core/CircularProgress';
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

import { TextField, MenuItem } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';

import EditorModal from './EditorModal';

const TableEditor = (props) => {
  const [modalVisible, setModalVisible] = useState();
  const [editedValue, setEditedValue] = useState({});

  const openModal = (index, position) => {
    console.log(position)
    setEditedValue({index, position});
    console.log(editedValue)
    setModalVisible(true);
  }

  return (
    <div>
      <EditorModal 
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        info={props.info}
        position={editedValue.position}
        index={editedValue.index}
        onChange={props.onChange}
        additionalData={props.additionalData}
      />
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
      <TableCell>Edytuj</TableCell>
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
          <TableCell><IconButton onClick={() => openModal(index, position)}><EditIcon/></IconButton></TableCell>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{position.title}</TableCell>
          <TableCell>
            {position.cash}
            </TableCell>
            {props.info !== 'income' && <TableCell>
              {position.bilingNr}
            </TableCell>}
          <TableCell data-info='team'>
          {position.team}
            </TableCell>
            {props.info !== 'outcome' && <TableCell>
          {position.name}
            </TableCell>}
          {props.info !== 'outcome' &&  <TableCell>
          {position.surname}
            </TableCell>}
          <TableCell>
          {position.event}
            </TableCell>
            {props.info !== 'income' && <TableCell>
         {position.foundingSource}
            </TableCell>}
            {props.info !== 'income' && <TableCell>
          {position.outcomeCategory}
            </TableCell>}
        </TableRow>
      ))}
    </TableBody>
  </Table> : <div className="loader"><CircularProgress/></div>}
    </div>
  )
}

export default TableEditor
