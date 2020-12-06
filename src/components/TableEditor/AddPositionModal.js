import { TextField, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';


import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';


const AddPositionModal = (props) => {
  const [cash, setCash] = useState(0);  
  const [bilingNr, setBilingNr] = useState('');
  const [team, setTeam] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [event, setEvent] = useState('');
  const [foundingSource, setFoundingSource] = useState('');
  const [outcomeCategory, setOutcomeCategory] = useState('');
  const [financeMethod, setFinanceMethod] = useState('');

  const addNewPosition = () => {
    const data = {
      cash,   
      bilingNr, 
      team, 
      name, 
      surname, 
      event, 
      foundingSource, 
      outcomeCategory, 
      financeMethod
    };

    props.addNewPosition(props.info, data);
    setCash('');  
    setBilingNr(0);
    setTeam('');
    setName('');
    setSurname('');
    setEvent('');
    setFoundingSource('');
    setOutcomeCategory('');
    setFinanceMethod('');
  };

  const modalBody = <Modal 
    open={props.modalVisible}  
    onClose={() => props.setModalVisible(false)}
  >
    <Paper className="modal__paper">
      <div className="modal">
        <Table size="medium">
          <TableHead>
            <TableRow>
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
              <TableCell>
                <TextField
                  size="medium"
                  value={cash}
                  margin="dense"
                  onChange={(e) => setCash(e.target.value)}
                />
              </TableCell>
              {props.info !== 'income' && <TableCell>
                <TextField
                  size="medium"
                  value={bilingNr}
                  margin="dense"
                  onChange={(e) => setBilingNr(e.target.value)}
                />
              </TableCell>}
              <TableCell data-info="team">
                <TextField
                  size="medium"
                  value={team}
                  margin="dense"
                  onChange={(e) => setTeam(e.target.value)}
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
                  size="medium"
                  value={name}
                  margin="dense"
                  onChange={(e) => setName(e.target.value)}
                />
              </TableCell>}
              {props.info !== 'outcome' && <TableCell>
                <TextField
                  size="medium"
                  value={surname}
                  margin="dense"
                  onChange={(e) => setSurname(e.target.value)}
                />
              </TableCell>}
              <TableCell>
                <TextField
                  size="medium"
                  value={event}
                  margin="dense"
                  onChange={(e) => setEvent(e.target.value)}
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
                  size="medium"
                  value={foundingSource}
                  margin="dense"
                  onChange={(e) => setFoundingSource(e.target.value)}
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
                  size="medium"
                  value={outcomeCategory}
                  margin="dense"
                  onChange={(e) => setOutcomeCategory(e.target.value)}
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
                  size="medium"
                  value={financeMethod}
                  margin="dense"
                  onChange={(e) => setFinanceMethod(e.target.value)}
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
          if (props.add) props.setAddingNewPosition(false);
          addNewPosition();
        }}>Dodaj nową pozycję</Button>
      </div>
    </Paper>
  </Modal>;

  return (<>{modalBody}</>);
};

export default AddPositionModal;