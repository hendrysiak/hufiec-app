import { Button } from '@material-ui/core';
import { AddIcon } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box, MenuItem, Modal, TextField } from '@mui/material';
import { DataGrid, GridCellEditCommitParams, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { createUser, deleteUser, fetchUsers, updateUser } from 'helpers/api-helpers/user';
import { Decrypt, generatePassword } from 'helpers/password.helper';
import { IUser } from 'models/users.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { localizationDataGrid } from 'shared/localization.helper';
import { teamsMap } from 'shared/team.helper';

interface NewUser extends Omit<IUser, 'roles'> {
  evidenceNumber: string;
  role: string;
}

const Role = (): JSX.Element => {
  const query = useQuery<Record<string, IUser>, Error>('users', fetchUsers);
  const [openAddUserModal, setOpenAddUserModal] = React.useState(false);
  const [user, setNewUser] = React.useState<NewUser>({
    evidenceNumber: '',
    role: '',
    team: '',
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
    }
  });

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setSnackbar({ children: 'Użytkownik dodany pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd', severity: 'error' });
    }
  });
  const deleteUserMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setSnackbar({ children: 'Użytkownik usunięty pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd', severity: 'error' });
    }
  });


  const columns = [
    { field: 'evidenceNumber', headerName: 'Nr ewidencji', width: 200, editable: false },
    { field: 'role', headerName: 'Rola', width: 150, editable: true },
    { field: 'team', headerName: 'Drużyna', width: 150, editable: true },
    { field: 'name', headerName: 'Imię', width: 200, editable: true },
    { field: 'surname', headerName: 'Nazwisko', width: 200, editable: true },
    // eslint-disable-next-line react/display-name
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      width: 100, 
      getActions: ({ id } : { id: string }) => {
        return [<GridActionsCellItem
          key={id}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDelete(id)}
          color="inherit"
        />];
      }, },
  ];

  const rows = !query?.data ? [] : Object.entries(query.data)
    .map(([evNum, user]: [string, IUser]) => {
        
      return {
        id: evNum,
        evidenceNumber: evNum,
        role: user.roles[0],
        team: user?.team ? user?.team : '',
        name: user?.name ?? '',
        surname: user?.surname ?? '',
      };
    });


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

  const handleCellEditCommit = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    updateUserMutation.mutate({ id, field, value });
    updateUserMutation.reset();
  };

  const handleDelete = (id: string) => (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    deleteUserMutation.mutate(id);
    deleteUserMutation.reset();
  };

  const handleAdd = () => {
    const newPassword = generatePassword(10);

    if (window.confirm(`Zapisz hasło dla użytkownika i zatwierdź:
      ${newPassword}
    `)) {
      const fullUser: Record<string, IUser> = {
        [user.evidenceNumber]: {
          roles: [user.role],
          name: user.name,
          surname: user.surname,
          team: user.team,
          password: Decrypt(newPassword),                                                                 
        }
      };
  
      createUserMutation.mutate(fullUser);
      createUserMutation.reset();
      setOpenAddUserModal(false);
    }
  };


  return (
    <div style={{ height: '90vh', width: '80%', margin: '0 auto' }}>
      <h2>Menager użytkowników</h2>
      <DataGrid
        columns={columns} 
        rows={rows}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        components={{
          Toolbar: EditToolbar
        }}
      />
      <Modal
        open={openAddUserModal}
      >
        <div style={{ width: '80%', backgroundColor: 'white', transform: 'translate(13%, 20%)', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ width: '100%' }} p={4} display="flex" justifyContent="space-between">
            <TextField
              style={{ margin: '16px', width: '40%' }}
              value={user.evidenceNumber}
              onChange={(e) => setNewUser({ ...user, evidenceNumber: e.target.value })}
              label="Numer ewidencji"
              variant="standard"
            />
            <TextField 
              style={{ margin: '16px', width: '40%' }}
              value={user.role}
              onChange={(e) => setNewUser({ ...user, role: e.target.value })}
              label="Rola"
              variant="standard"
              select
            >
              {['leader', 'admin'].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box style={{ width: '100%' }} p={4} display="flex" justifyContent="space-between">
            <TextField 
              style={{ margin: '16px', width: '40%' }}
              value={user.team}
              onChange={(e) => setNewUser({ ...user, team: e.target.value })}
              select
              label="Drużyna"
              variant="standard"
            >
              {teamsMap.map((team) => (
                <MenuItem key={team.teamId} value={team.teamId}>{team.name}</MenuItem>
              ))}
            </TextField>
            <TextField 
              style={{ margin: '16px', width: '40%' }}
              value={user.name}
              onChange={(e) => setNewUser({ ...user, name: e.target.value })}
              label="Imię"
              variant="standard"
            />
          </Box>
          <Box p={4} style={{ width: '100%' }} display="flex" justifyContent="center">
            <TextField 
              style={{ margin: '16px', width: '40%' }}
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
                role: '',
                team: '',
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

export default Role;