import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, GridActionsCellItem, GridAlignment } from '@mui/x-data-grid';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { deleteProposal } from 'helpers/api-helpers/proposal';
import { deleteTeamMember, permanentDeleteTeamMember } from 'helpers/editing-db.handler';
import { ProposalKind } from 'models/global.enum';
import { Proposal } from 'models/proposal.models';
import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'helpers/member-fee.helper';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';

import { localizationDataGrid } from 'shared/localization.helper';

import { kindNameConverter } from '../../helpers/proposal.helper';

interface RegistryProposalRow {
  team: string;
  author: string;
  name: string;
  surname: string;
  dateOfAdd: string | Date;
  dateOfDelete: string | Date;
  feeState: number;
  newTeam: string;
}

interface RegistryProposalProps {
  rows: Proposal[];
  isAdmin?: boolean;
}

function RegistryProposal(props: RegistryProposalProps): JSX.Element {
  const { setSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const deleteProposalMutation = useMutation(deleteProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('proposal');
      setSnackbar({ children: 'Propozycja rozwiązana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu akcji', severity: 'error' });
    },
  });

  const handleResolveRegistryProposal = (proposalId: string) => async (event: { stopPropagation: () => void; }) => {
    if (!window.confirm('Jesteś pewny/-a, że rozwiązać akcję?')) return;
    event.stopPropagation();
    const proposal = props.rows.find((r) => r.id === proposalId);

    if (proposal?.kind !== ProposalKind.Delete) {
      if (!window.confirm('Akcja edycji członka jest jedynie w celu informacyjnym - upewnij się, że w Tipi jest wszystko ustawione jak należy, a rozwiązanie akcji jedynie usunie ją z listy (przeniesienia dokonał już drużynowy)')) return;
      try {
        setSnackbar({ children: 'Pomyślnie usunięto członka', severity: 'success' });
        deleteProposalMutation.mutate(proposalId);
        deleteProposalMutation.reset();
      } catch (err) {
        setSnackbar({ children: 'Wystąpił błąd przy usuwaniu członka', severity: 'error' });
      }
    } else {
      const user = proposal?.oldValues as APIPerson;
      const feeState = countingMemberFee(user);

      try {
        if (feeState < 0) {
          user.dateOfDelete = (proposal?.newValues as { dateOfDelete: Date }).dateOfDelete;
          await deleteTeamMember(user);
        } else {
          await permanentDeleteTeamMember(user);
        }
        setSnackbar({ children: 'Pomyślnie usunięto członka', severity: 'success' });
        deleteProposalMutation.mutate(proposalId);
        deleteProposalMutation.reset();
      } catch (err) {
        setSnackbar({ children: 'Wystąpił błąd przy usuwaniu członka', severity: 'error' });
      }
    }
  };

  const handleDeleteRegistryProposal = (proposalId: string) => (event: { stopPropagation: () => void; }) => {
    const proposalKind = props.rows.find((p) => p.id === proposalId)?.kind;

    if (proposalKind === ProposalKind.Move) {
      window.alert(`
      Pamiętaj, że usunięcie akcji nie spowoduje przywrócenia członka. 
      Jeśli nastąpiła pomyłka, zwróć się z prośbą o cofnięcie zmiany
      do drużynowego drużyny docelowej lub administratora aplikacji.
      `);
    }

    if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć akcję?')) return;
    event.stopPropagation();
    deleteProposalMutation.mutate(proposalId);
    deleteProposalMutation.reset();
  };

  const columns = [
    {
      field: 'team', headerName: 'Drużyna', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'author', headerName: 'Zgłaszający', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'kind', headerName: 'Rodzaj', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'surname', headerName: 'Nazwisko', editable: true, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'name', headerName: 'Imię', editable: false, type: '', width: 100, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'dateOfAdd', headerName: 'Data dodania', editable: true, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'dateOfDelete', headerName: 'Proponowana data usunięcia', editable: true, width: 150, align: 'center' as GridAlignment, type: 'date', headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'newTeam', headerName: 'Nowa drużyna', editable: true, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'feeState', headerName: 'Stan składek', editable: true, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      width: 100,
      align: 'center' as GridAlignment,
      headerAlign: 'center' as GridAlignment,
      getActions: ({ id } : { id: string }) => {
        if (props.isAdmin) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<CheckIcon />}
              label="Resolve"
              onClick={handleResolveRegistryProposal(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              key={id}
              icon={<CloseIcon />}
              label="Delete"
              onClick={handleDeleteRegistryProposal(id)}
              color="inherit"
            />,
          ];
        }

        return [<GridActionsCellItem
          key={id}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteRegistryProposal(id)}
          color="inherit"
        />];
      },
    },
  ];

  return (
    <div style={{ height: '100%' }}>
      <DataGrid
        columns={columns}
        rows={props.rows.map((r) => ({
          id: r.id,
          team: r.team ?? '',
          kind: kindNameConverter(r.kind),
          author: r.author,
          name: (r?.oldValues as APIPerson)?.name ?? '',
          surname: (r?.oldValues as APIPerson)?.surname ?? '',
          dateOfAdd: new Date((r?.oldValues as APIPerson)?.dateOfAdd as string | Date).toLocaleDateString() ?? '',
          dateOfDelete: (r?.newValues as { dateOfDelete: string | Date })?.dateOfDelete ? new Date((r?.newValues as { dateOfDelete: string | Date })?.dateOfDelete).toLocaleDateString() : '',
          feeState: countingMemberFee(r?.oldValues as APIPerson),
          newTeam: (r?.newValues as APIPerson).team ?? '',
        }))}
        // onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
      />
    </div>
  );
}

export default RegistryProposal;
