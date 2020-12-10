import React, { useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress';

import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';

import EditorModal from './EditorModal';
import AddPositionModal from './AddPositionModal';

const TableEditor = (props) => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [editedValue, setEditedValue] = useState({});

  const openModal = (index, position, edit) => {
    if (edit) {
      props.setAddingNewPosition(true)
      setModalAddVisible(true);
    } else {
      setEditedValue({index, position});
      setModalEditVisible(true);
    }
  }

  return (
    <div>
      <div class="table__add">
      <Tooltip title={`Dodaj ${props.info === 'income' ? 'przychód' : 'koszt'}`} aria-label="add-position">
          <IconButton><AddIcon onClick={() => openModal(-1, {}, true)}/></IconButton>
      </Tooltip>
      </div>
      <EditorModal 
        modalVisible={modalEditVisible}
        setModalVisible={setModalEditVisible}
        info={props.info}
        position={editedValue.position}
        index={editedValue.index}
        onChange={props.onChange}
        additionalData={props.additionalData}
        add={props.add}
        setAddingNewPosition={props.setAddingNewPosition}
      />
      <AddPositionModal 
        modalVisible={modalAddVisible}
        setModalVisible={setModalAddVisible}
        additionalData={props.additionalData}
        add={props.add}
        info={props.info}
        setAddingNewPosition={props.setAddingNewPosition}
        addNewPosition={props.addNewPosition}
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
      {!props.disabled && <TableCell>Edytuj</TableCell>}
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
          {!props.disabled && <TableCell><IconButton onClick={() => openModal(index, position)}><EditIcon/></IconButton></TableCell>}
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
