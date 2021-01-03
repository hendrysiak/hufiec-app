import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import { Alert } from '@material-ui/lab';

import React, { useState } from 'react';

import { FinanceMethod, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { IncomesWithImportDate, OutcomesWithFinanceMethod } from 'models/income.models';


import AddPositionModal from './AddPositionModal';
import EditorModal from './EditorModal';

type Props = {
  data: (IncomesWithImportDate | OutcomesWithFinanceMethod)[];
  onChange: (index: number, data: string, value: string) => void;
  info: string;
  save: boolean;
  saveHandler: () => void;
  additionalData: {
    foundingSources: FoundingSources[];
    outcomeCategory: OutcomeCategory[];
    teams: string[];
    codes: string[];
  }
  currentTeam: string;
  currentEvent: string
  currentCategory: string;
  currentFounding: string;
  add: boolean;
  setAddingNewPosition: (info: boolean) => void;
  addNewPosition: (info: string, data: OutcomesWithFinanceMethod | IncomesWithImportDate) => void;
  disabled?: boolean;
}

const TableEditor = (props: Props): JSX.Element => {
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [editedValue, setEditedValue] = useState<{
    index: number, 
    position:IncomesWithImportDate | OutcomesWithFinanceMethod
  }>();

  const openModal = (
    index: number, 
    position: IncomesWithImportDate | OutcomesWithFinanceMethod, 
    edit?: boolean
  ) => {

    if (edit) {
      props.setAddingNewPosition(true);
      setModalAddVisible(true);
    } else {
      setEditedValue({ index, position });
      setModalEditVisible(true);
    }
  };

  const newIncome: IncomesWithImportDate = {
    cash: 0,
    event: null,
    importDate: null,
    name: null,
    surname: null,
    team: null,
    year: null,
    dateOfBook: '',
    title: ''
  };

  const newOutcome: OutcomesWithFinanceMethod = {
    cash: 0,
    event: null,
    importDate: null,
    name: null,
    surname: null,
    team: null,
    year: null,
    dateOfBook: '',
    title: '',
    financeMethod: FinanceMethod.Cash
  };

  const dataToUse = props.info === 'income' ? newIncome : newOutcome;

  return (
    <div>
      <div className="table__add">
        <Tooltip title={`Dodaj ${props.info === 'income' ? 'przychód' : 'koszt'}`} aria-label="add-position">
          <IconButton><AddIcon onClick={() => openModal(-1, dataToUse, true)}/></IconButton>
        </Tooltip>
      </div>
      <EditorModal 
        modalVisible={modalEditVisible}
        setModalVisible={setModalEditVisible}
        info={props.info}
        position={editedValue && editedValue.position}
        index={editedValue && editedValue.index}
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
              {!props.disabled && <TableCell>
                <IconButton onClick={() => openModal(index, position)}><EditIcon/>
                </IconButton>
              </TableCell>}
              <TableCell>{index + 1}</TableCell>
              <TableCell>{position.title}</TableCell>
              <TableCell>
                {position.cash}
              </TableCell>
              {props.info !== 'income' && <TableCell>
                {position.bilingNr}
              </TableCell>}
              <TableCell data-info="team">
                {position.team}
              </TableCell>
              {props.info !== 'outcome' && <TableCell>
                {position.name}
              </TableCell>}
              {props.info !== 'outcome' && <TableCell>
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
  );
};

export default TableEditor;
