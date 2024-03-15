import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import {
  DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridToolbarContainer,
} from '@mui/x-data-grid';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { saveTeam, editTeam, deleteTeam } from 'helpers/api-helpers/team';
import { useTeams } from 'helpers/hooks/useTeams';
import { Team } from 'models/team';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { columnAligning } from 'shared/grid.helper';
import { localizationDataGrid } from 'shared/localization.helper';

function TeamsEditor(): JSX.Element {
  const teams = useTeams();

  // const [localTeams, setLocalTeams] = React.useState<Team[]>(teams || []);

  const { setSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  const saveTeamMutation = useMutation(saveTeam, {

    onSuccess: () => {
      queryClient.invalidateQueries('teams');
      setSnackbar({ children: 'Drużyna zapisana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy zapisywaniu drużyny', severity: 'error' });
    },
  });

  const editTeamMutation = useMutation(editTeam, {

    onSuccess: () => {
      queryClient.invalidateQueries('teams');
      setSnackbar({ children: 'Drużyna wyedytowana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy edytowaniu drużyny', severity: 'error' });
    },
  });

  const deleteTeamMutation = useMutation(deleteTeam, {

    onSuccess: () => {
      queryClient.invalidateQueries('teams');
      setSnackbar({ children: 'Drużyna usunięta pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu drużyny', severity: 'error' });
    },
  });

  const handleDelete = (teamId: string) => (event: { stopPropagation: () => void; }) => {
    if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć drużynę?')) return;
    event.stopPropagation();
    if (teamId) {
      deleteTeamMutation?.mutate(teamId);
      deleteTeamMutation?.reset();
    } else {
      return setSnackbar({ children: 'Wystąpił nieoczekiwany błąd przy usuwaniu kodu', severity: 'error' });
    }
  };

  const handleCellEditCommit = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    const foundedTeam: Team | undefined = teams.find((t) => t.id === id);

    if (foundedTeam) {
      editTeamMutation?.mutate({ ...foundedTeam, [field]: value });
      editTeamMutation?.reset();
    } else {
      setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
    }
  };

  const columns = [
    {
      field: 'teamId', headerName: 'ID drużyny', editable: true, width: 100, ...columnAligning,
    },
    {
      field: 'name', headerName: 'Nazwa', editable: true, width: 500, ...columnAligning,
    },
    {
      field: 'nameToUse', headerName: 'Nazwa użytkowa (do pism)', editable: true, width: 500, ...columnAligning,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      width: 100,
      getActions: ({ id } : { id: string }) => {
        const actions = [
          <GridActionsCellItem
            key={id}
            icon={<CloseIcon />}
            label="Delete"
            onClick={handleDelete(id)}
            color="inherit"
          />,
        ];

        return actions;
      },
      ...columnAligning,
    },
  ];

  function EditToolbar() {
    const handleClick = () => {
      saveTeamMutation?.mutate({
        id: '',
        name: '',
        nameToUse: '',
        teamId: 0,
      });
      saveTeamMutation?.reset();
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Dodaj rekord
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <main style={{ height: '85vh' }}>
      <DataGrid
        columns={columns}
        rows={teams}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        rowHeight={52}
        components={{
          Toolbar: EditToolbar,
        }}
      />
    </main>
  );
}

export default TeamsEditor;
