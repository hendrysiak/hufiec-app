import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box, Button, Checkbox, FormControlLabel, MenuItem, Modal, TextField,
} from '@mui/material';
import {
  DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridRenderCellParams, GridToolbarContainer,
} from '@mui/x-data-grid';
import React from 'react';

import { useSelector } from 'react-redux';

import { useLocation } from 'react-router';

import { saveProposal } from 'helpers/api-helpers/proposal';
import { addTeamMember, editTeamMember } from 'helpers/editing-db.handler';
import { useTeams } from 'helpers/hooks/useTeams';
import { checkColumnRenderer } from 'helpers/render/checkColumnRenderer';
import { ProposalArea, ProposalKind } from 'models/global.enum';
import { Proposal } from 'models/proposal.models';
import { APIPerson, Person } from 'models/registry.models';

import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { localizationDataGrid } from 'shared/localization.helper';
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
  row?: Record<string, unknown>;
}

export function ListOfMembers({ rows }: ListOfMembersProps): JSX.Element {
  const team = useSelector((state: RootState) => state.user.team);
  const author = useSelector((state: RootState) => state.user.evidenceNumber);
  const teamsMap = useTeams();
  const [openAddUserModal, setOpenAddUserModal] = React.useState(false);
  const [openMoveUserModal, setOpenMoveUserModal] = React.useState(false);
  const [userToMoveId, setUserToMoveId] = React.useState('');
  const [userNewTeam, setUserNewTeam] = React.useState('');
  const [user, setNewUser] = React.useState<Omit<NewUser, 'role' | 'team' | 'dateOfAdd'>>({
    evidenceNumber: '',
    name: '',
    surname: '',
    disability: false,
    instructor: false,
  });

  const { setSnackbar } = useSnackbar();

  const { pathname } = useLocation();

  function EditToolbar() {
    const handleClick = () => setOpenAddUserModal(true);

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Dodaj rekord
        </Button>
      </GridToolbarContainer>
    );
  }

  const handleCellEditCommit = (params: ExtendedGridCellEditCommitParams) => {
    const { row, field, value } = params;
    editTeamMember(Number(pathname.slice(1)), { ...row, [field]: value });
    setSnackbar({ children: 'Użytkownik edytowany pomyślnie', severity: 'success' });
  };

  const handleDelete = (id: string) => (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();

    const currentUser = rows.find((r) => r.id === id);

    if (currentUser?.dateOfDelete) return setSnackbar({ children: 'Próbujesz usunąć usuniętego użytkownika', severity: 'error' });

    if (author && window.confirm('Czy napewno chcesz zgłosić użytkownika do usunięcia?')) {
      const proposal: Proposal = {
        elementId: id,
        area: ProposalArea.Registry,
        kind: ProposalKind.Delete,
        author,
        team: Number(pathname.slice(1)),
        oldValues: currentUser,
        newValues: { dateOfDelete: new Date() },
      };
      saveProposal(proposal);
      setSnackbar({ children: 'Prośba o usunięcie pomyślnie zapisana', severity: 'success' });
    }
  };

  const handleMove = async () => {
    const currentUser = rows.find((r) => r.id === userToMoveId);

    if (author && window.confirm('Czy napewno chcesz przenieść użytkownika?')) {
      try {
        const proposal: Proposal = {
          elementId: userToMoveId,
          area: ProposalArea.Registry,
          kind: ProposalKind.Move,
          author,
          team: Number(pathname.slice(1)),
          oldValues: { ...currentUser },
          newValues: { ...currentUser, team: userNewTeam },
        };

        await Promise.all([
          saveProposal(proposal),
          editTeamMember(Number(pathname.slice(1)), { id: userToMoveId, team: Number(userNewTeam) }),
        ]);

        setSnackbar({ children: 'Przeniesienie zakończone sukcesem', severity: 'success' });
      } catch (err) {
        setSnackbar({ children: 'Nieoczekiwany błąd', severity: 'error' });
      }

      setUserToMoveId('');
      setUserNewTeam('');
      setOpenMoveUserModal(false);
    }
  };

  const handleAdd = async () => {
    if (!user.evidenceNumber || !user.name || !user.surname) return window.alert('Wszystkie pola muszą być wypełnione');

    if (window.confirm('Czy napewno chcesz dodać takiego użytkownika')) {
      const fullUser = {
        evidenceNumber: user.evidenceNumber as string,
        name: user.name as string,
        surname: user.surname as string,
        disability: user.disability,
        instructor: user.instructor,
      };

      try {
        if (team) {
          addTeamMember(Number(pathname.slice(1)), fullUser);
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
        disability: false,
        instructor: false,
      });
      setOpenAddUserModal(false);
    }
  };

  const columns = [
    {
      field: 'lp', headerName: 'LP', editable: false, width: 40,
    },
    {
      field: 'surname', headerName: 'Nazwisko', editable: true, width: 150,
    },
    {
      field: 'name', headerName: 'Imię', editable: true, width: 150,
    },
    {
      field: 'fee', headerName: 'Składki', editable: false, width: 150,
    },
    {
      field: 'isDeleted', headerName: 'Usunięty/-a', editable: false, width: 100,
    },
    {
      field: 'evidenceNumber', headerName: 'Nr ewidencji', editable: true, width: 150,
    },
    {
      field: 'disability', headerName: 'NS?', editable: false, type: 'boolean', width: 80, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    {
      field: 'instructor', headerName: 'Instruktor?', editable: true, type: 'boolean', width: 100, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    // eslint-disable-next-line react/display-name
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      minWidth: 150,
      getActions: ({ id } : { id: string }) => [
        <GridActionsCellItem
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
        />,
        // Debt - for future implementation
        // <GridActionsCellItem
        //   key={id}
        //   icon={<AttachMoneyIcon />}
        //   label="Spa dug"
        //   onClick={() => {
        //     setUserToMoveId(id);
        //     setOpenMoveUserModal(true);
        //   }}
        //   color="inherit"
        // />
      ],
    },
  ];

  return (
    <div style={{ height: '90vh' }}>
      <DataGrid
        columns={columns}
        rows={rows.map((r) => ({ ...r, id: r.id, evidenceNumber: r.evidenceNumber ?? '' }))}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        components={{
          Toolbar: EditToolbar,
        }}
      />
      <Modal
        open={openMoveUserModal}
      >
        <div style={{
          width: '80%', backgroundColor: 'white', transform: 'translate(13%, 20%)', display: 'flex', flexDirection: 'column',
        }}
        >
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
            <Button
              style={{ width: '40%' }}
              color="secondary"
              variant="contained"
              onClick={() => {
                setOpenMoveUserModal(false);
                setUserNewTeam('');
              }}
            >
              Anuluj
            </Button>
            <Button style={{ width: '40%' }} color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleMove}>
              Przenieś
            </Button>
          </Box>
        </div>
      </Modal>
      <Modal
        open={openAddUserModal}
      >
        <div style={{
          width: '80%', backgroundColor: 'white', transform: 'translate(13%, 20%)', display: 'flex', flexDirection: 'column',
        }}
        >
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
            <FormControlLabel
              className="dateCheckbox"
              control={(
                <Checkbox
                  checked={Boolean(user.disability)}
                  onChange={(e) => setNewUser({ ...user, disability: e.target.checked })}
                  name="disability"
                  color="primary"
                />
)}
              label="NS?"
            />
            <FormControlLabel
              className="dateCheckbox"
              control={(
                <Checkbox
                  checked={Boolean(user.instructor)}
                  onChange={(e) => setNewUser({ ...user, instructor: e.target.checked })}
                  name="instructor"
                  color="primary"
                />
)}
              label="Instruktor?"
            />
          </Box>
          <Box p={4} style={{ width: '100%' }} display="flex" justifyContent="space-between">
            <Button
              style={{ width: '40%' }}
              color="secondary"
              variant="contained"
              onClick={() => {
                setOpenAddUserModal(false);
                setNewUser({
                  evidenceNumber: '',
                  name: '',
                  surname: '',
                  disability: false,
                  instructor: false,
                });
              }}
            >
              Anuluj
            </Button>
            <Button style={{ width: '40%' }} color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              Dodaj
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
