import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Box, MenuItem, Modal, TextField,
} from '@mui/material';

import {
  DataGrid, GridCellEditCommitParams, GridActionsCellItem, GridToolbarContainer, GridColumns, GridRenderCellParams,
} from '@mui/x-data-grid';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  createUser, deleteUser, fetchUsers, updateUser,
} from 'helpers/api-helpers/user';
import { useTeams } from 'helpers/hooks/useTeams';
import { Encrypt, generatePassword } from 'helpers/password.helper';
import { AuthUser, UserRoles } from 'models/users.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { localizationDataGrid } from 'shared/localization.helper';
import { TeamMultiCheckboxesEditCell } from 'shared/Cells/TeamCell';

interface NewUser extends AuthUser {
  uid: string;
}

function Role(): JSX.Element {
  const query = useQuery<Record<string, AuthUser>, Error>('users', fetchUsers);
  const teamsMap = useTeams();
  console.log(teamsMap);
  const [openAddUserModal, setOpenAddUserModal] = React.useState(false);
  const [user, setNewUser] = React.useState<NewUser>({
    uid: '',
    evidenceNumber: '',
    role: 'leader',
    team: [],
    name: '',
    surname: '',
  });

  const { setSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setSnackbar({ children: 'Użytkownik zaktualizowany pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd', severity: 'error' });
    },
  });

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setSnackbar({ children: 'Użytkownik dodany pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd', severity: 'error' });
    },
  });
  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setSnackbar({ children: 'Użytkownik usunięty pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd', severity: 'error' });
    },
  });

  const columns = [
    {
      field: 'uid', headerName: 'uid', width: 200, editable: true,
    },
    {
      field: 'evidenceNumber', headerName: 'Nr ewidencji', width: 200, editable: true,
    },
    {
      field: 'roles', headerName: 'Rola', type: 'singleSelect', valueOptions: ['admin', 'leader'], width: 150, editable: true,
    },
    {
      field: 'team', 
      headerName: 'Drużyna', 
      renderEditCell: (params: GridRenderCellParams<number[]>) => <TeamMultiCheckboxesEditCell params={params} />,
      width: 350, 
      editable: true,
    },
    {
      field: 'name', headerName: 'Imię', width: 200, editable: true,
    },
    {
      field: 'surname', headerName: 'Nazwisko', width: 200, editable: true,
    },
    {
      field: 'email', headerName: 'Email', width: 300, editable: true,
    },
    // eslint-disable-next-line react/display-name
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      width: 100,
      getActions: ({ id } : { id: string }) => [<GridActionsCellItem
        key={id}
        icon={<DeleteIcon />}
        label="Delete"
        onClick={handleDelete(id)}
        color="inherit"
      />],
    },
  ];

  const rows = !query?.data ? [] : Object.entries(query.data)
    .map(([uid, user]: [string, AuthUser]) => ({
      id: uid,
      uid: uid,
      evidenceNumber: user.evidenceNumber,
      roles: user.role,
      team: user?.team ? user?.team : '',
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      email: user?.email ?? ''
    }));

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

  const handleCellEditCommit = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    if (field === 'roles') {
      updateUserMutation.mutate({ id, field, value: [value] });
    } else {
      updateUserMutation.mutate({ id, field, value });
    }

    updateUserMutation.reset();
  };

  const handleDelete = (id: string) => (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    deleteUserMutation.mutate(id);
    deleteUserMutation.reset();
  };

  const handleAdd = () => {
      const fullUser: Record<string, AuthUser> = {
        [user.uid]: {
          role: user.role,
          name: user.name,
          surname: user.surname,
          team: user.team,
          evidenceNumber: user.evidenceNumber,
        }
      };

      createUserMutation.mutate(fullUser);
      createUserMutation.reset();
      setOpenAddUserModal(false);
  };

  return (
    <main style={{ height: '85vh' }}>
      <h2>Menager użytkowników</h2>
      <DataGrid
        columns={columns}
        rows={rows}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        components={{
          Toolbar: EditToolbar,
        }}
      />
      <Modal
        open={openAddUserModal}
      >
        <div style={{
          width: '80%', backgroundColor: 'white', transform: 'translate(13%, 20%)', display: 'flex', flexDirection: 'column',
        }}
        >
          <Box style={{ width: '100%' }} p={4} display="flex" justifyContent="space-between">
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.uid}
              onChange={(e) => setNewUser({ ...user, uid: e.target.value })}
              label="UID"
              variant="standard"
            />
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.evidenceNumber}
              onChange={(e) => setNewUser({ ...user, evidenceNumber: e.target.value })}
              label="Numer ewidencji"
              variant="standard"
            />
          </Box>
          <Box style={{ width: '100%' }} p={4} display="flex" justifyContent="space-between">
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.role}
              onChange={(e) => setNewUser({ ...user, role: e.target.value as UserRoles })}
              label="Rola"
              variant="standard"
              select
            >
              {['leader', 'admin'].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.team}
              onChange={(e) => setNewUser({ ...user, team: [...user?.team, e.target.value] })}
              select
              label="Drużyna"
              variant="standard"
            >
              {teamsMap.map((team) => (
                <MenuItem key={team.teamId} value={team.teamId}>{team.name}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box style={{ width: '100%' }} display="flex" justifyContent="center">
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.name}
              onChange={(e) => setNewUser({ ...user, name: e.target.value })}
              label="Imię"
              variant="standard"
            />
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.surname}
              onChange={(e) => setNewUser({ ...user, surname: e.target.value })}
              label="Nazwisko"
              variant="standard"
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
                  uid: '',
                  evidenceNumber: '',
                  role: 'leader',
                  team: [],
                  name: '',
                  surname: '',
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
    </main>
  );
}

export default Role;
