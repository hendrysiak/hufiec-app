import { AddIcon } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, AlertProps, Box, Button, MenuItem, Modal, Snackbar, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridToolbarContainer } from '@mui/x-data-grid';
import React from 'react';

import { useSelector } from 'react-redux';

import { addTeamMember, editTeamMember, saveProposal } from 'helpers/editing-db.handler';
import { Proposal, ProposalArea, ProposalKind } from 'models/global.enum';
import { APIPerson, Person } from 'models/registry.models';

import { localizationDataGrid } from 'shared/localization.helper';
import { teamsMap } from 'shared/team.helper';
import { RootState } from 'store/models/rootstate.model';

interface IRows extends APIPerson {
  lp: string | number;
  fee: number;
  isDeleted: string
}

interface ListOfMembersProps {
  rows: IRows[],
  navHeight: number
}

interface NewUser extends Person {
  evidenceNumber: string;
}

interface ExtendedGridCellEditCommitParams extends GridCellEditCommitParams {
  row?: Record<string, any>;
}

export const ListOfMembers = ({ rows, navHeight }: ListOfMembersProps): JSX.Element => {
  const team = useSelector((state: RootState) => state.user.team);
  const author = useSelector((state: RootState) => state.user.evidenceNumber);
  const [openAddUserModal, setOpenAddUserModal] = React.useState(false);
  const [openMoveUserModal, setOpenMoveUserModal] = React.useState(false);
  const [userToMoveId, setUserToMoveId] = React.useState('');
  const [userNewTeam, setUserNewTeam] = React.useState('');
  const [user, setNewUser] = React.useState<Omit<NewUser, 'role' | 'team'>>({
    evidenceNumber: '',
    name: '',
    surname: '',
  });

  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  'children' | 'severity'
  > | null>(null);


  const EditToolbar = () => {
  
    const handleClick = () => setOpenAddUserModal(true);
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Dodaj rekord
        </Button>
      </GridToolbarContainer>
    );
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleCellEditCommit = (params: ExtendedGridCellEditCommitParams) => {
    const { row, field, value } = params;
    if (team) {
      editTeamMember(team, { ...row, [field]: value });
      setSnackbar({ children: 'Użytkownik edytowany pomyślnie', severity: 'success' });
    };
  };

  const handleDelete = (id: string) => (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();

    if (author && window.confirm('Czy napewno chcesz zgłosić użytkownika do usunięcia?')) {
      const proposal: Proposal = {
        id: id,
        area: ProposalArea.Registry,
        kind: ProposalKind.Delete,
        author: author
      };
      saveProposal(proposal);
      setSnackbar({ children: 'Prośba o usunięcie pomyślnie zapisana', severity: 'success' });
    }
  };

  const handleMove = async () => {

    if (author && window.confirm('Czy napewno chcesz przenieść użytkownika?')) {
      try {
        if (team) {
          await editTeamMember(team, { id: userToMoveId, team: userNewTeam });
          setSnackbar({ children: 'Przeniesienie zakończone sukcesem', severity: 'success' });
        } else {
          setSnackbar({ children: 'Błąd drużyny - odśwież', severity: 'error' });
        }
      }
      catch (err) {
        setSnackbar({ children: 'Nieoczekiwany błąd', severity: 'error' });
      }

      setUserToMoveId('');
      setUserNewTeam('');
      setOpenMoveUserModal(false);
    }
  };

  const handleAdd = async () => {

    if (!user.evidenceNumber || !user.name || !user.surname) return window.alert('Wszystkie pola muszą być wypełnione');

    if (window.confirm(`Czy napewno chcesz dodać takiego użytkownika`)) {
      
      const fullUser = {
        evidenceNumber: user.evidenceNumber as string,
        name: user.name as string,
        surname: user.surname as string,
      };

      try {
        if (team) {
          addTeamMember(team, fullUser);
          setSnackbar({ children: 'Użytkownik dodany pomyślnie', severity: 'success' });
        } else {
          setSnackbar({ children: 'Błąd drużyny - odśwież', severity: 'error' });
        }
      } catch (err) {
        setSnackbar({ children: 'Nieoczekiwany błąd', severity: 'error' });
      }

      setNewUser({
        evidenceNumber: '',
        name: '',
        surname: '',
      });
      setOpenAddUserModal(false);
    }
  };

  const columns = [
    { field: 'lp', headerName: 'LP', editable: false, width: 40 },
    { field: 'surname', headerName: 'Nazwisko', editable: true, width: 150 },
    { field: 'name', headerName: 'Imię', editable: true, width: 150 },
    { field: 'fee', headerName: 'Składki', editable: false, width: 150 },
    { field: 'isDeleted', headerName: 'Usunięty/-a', editable: false, type: '', width: 100 },
    { field: 'evidenceNumber', headerName: 'Nr ewidencji', editable: true, width: 150 },
    // eslint-disable-next-line react/display-name
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      minWidth: 150, 
      getActions: ({ id } : { id: string }) => {
        return [<GridActionsCellItem
          key={id}
          icon={<DeleteIcon />}
          label="Usuń"
          onClick={handleDelete(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          key={id}
          icon={<EditIcon />}
          label="Przenieś"
          onClick={() => {
            setUserToMoveId(id);
            setOpenMoveUserModal(true);
          }}
          color="inherit"
        />];
      }, },
  ];


  return (
    <div style={{ height: '80vh' }}>
      <DataGrid
        columns={columns} 
        rows={rows.map(r => { 
          return { ...r, id: r.id, evidenceNumber: r.evidenceNumber ?? '' };
        })}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        components={{
          Toolbar: EditToolbar
        }}
      />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
      <Modal
        open={openMoveUserModal}
      >
        <div style={{ width: '80%', backgroundColor: 'white', transform: 'translate(13%, 20%)', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ width: '100%' }} p={4} display="flex" flexDirection="column" justifyContent="center">
            <TextField 
              style={{ margin: '16px', width: '100%' }}
              value={userNewTeam}
              onChange={(e) => setUserNewTeam(e.target.value)}
              select
              label="Nowa drużyna"
              variant="standard"
            >
              {teamsMap.map((team) => (
                <MenuItem key={team.teamId} value={team.teamId}>{team.name}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box p={4} style={{ width: '100%' }} display="flex" justifyContent="space-between">
            <Button style={{ width: '40%' }} color="secondary" variant="contained" onClick={() => {
              setOpenMoveUserModal(false);
              setUserNewTeam('');
            }}>
            Anuluj
            </Button>
            <Button style={{ width: '40%' }}color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleMove}>
            Przenieś
            </Button>
          </Box>
        </div>
      </Modal>
      <Modal
        open={openAddUserModal}
      >
        <div style={{ width: '80%', backgroundColor: 'white', transform: 'translate(13%, 20%)', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ width: '100%' }} p={4} display="flex" flexDirection="column" justifyContent="center">
            <TextField
              style={{ margin: '16px' }}
              value={user.evidenceNumber}
              onChange={(e) => setNewUser({ ...user, evidenceNumber: e.target.value })}
              label="Numer ewidencji"
              variant="standard"
            />
            <TextField 
              style={{ margin: '16px' }}
              value={user.name}
              onChange={(e) => setNewUser({ ...user, name: e.target.value })}
              label="Imię"
              variant="standard"
            />
            <TextField 
              style={{ margin: '16px' }}
              value={user.surname}
              onChange={(e) => setNewUser({ ...user, surname: e.target.value })}
              label="Nazwisko"
              variant="standard"
            />
          </Box>
          <Box p={4} style={{ width: '100%' }} display="flex" justifyContent="space-between">
            <Button style={{ width: '40%' }} color="secondary" variant="contained" onClick={() => {
              setOpenAddUserModal(false);
              setNewUser({
                evidenceNumber: '',
                name: '',
                surname: '',
              });
            }}>
            Anuluj
            </Button>
            <Button style={{ width: '40%' }}color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Dodaj
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};