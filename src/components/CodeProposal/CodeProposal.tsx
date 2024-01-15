import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  DataGrid,
  GridActionsCellItem,
  GridAlignment,
  GridCellEditCommitParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { deleteCode, editCode, saveCode } from 'helpers/api-helpers/codes';
import { saveDecision } from 'helpers/api-helpers/decision';
import { deleteProposal, editProposal } from 'helpers/api-helpers/proposal';
import { checkColumnRenderer } from 'helpers/render/checkColumnRenderer';
import { ICode } from 'models/codes.models';
import { Decision } from 'models/decision.model';
import { DecisionArea, ProposalArea, ProposalKind } from 'models/global.enum';

import { Proposal } from 'models/proposal.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { columnAligning } from 'shared/grid.helper';
import { localizationDataGrid } from 'shared/localization.helper';

import Letter from 'shared/PDF/Letter/Letter';
import { useTeams } from 'helpers/hooks/useTeams';
import { StyledDataGrid } from 'shared/StyledDataGrid/StyledDataGrid';


interface CodeProposalProps {
  isAdmin?: boolean;
  rows: Proposal[];
}


function CodeProposal(props: CodeProposalProps): JSX.Element {
  const { setSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const teamsMap = useTeams();

  const editProposalMutation = useMutation(editProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('proposal');
      setSnackbar({ children: 'Propozycja wyedytowana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu akcji', severity: 'error' });
    },
  });

  const deleteProposalMutation = useMutation(deleteProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('proposal');
      setSnackbar({ children: 'Propozycja rozwiązana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu akcji', severity: 'error' });
    },
  });

  const deleteCodeMutation = useMutation(deleteCode, {

    onSuccess: () => {
      queryClient.invalidateQueries('codes');
      setSnackbar({ children: 'Kod usunięty pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu kodu', severity: 'error' });
    },
  });

  const firstAcceptHandler = (element: Proposal | undefined) => async (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    if (!element) return;

    const values = element.newValues as ICode;

    if (window.confirm('Napewno zaakceptować kod? Operacji nie da się cofnąć (kod wciąż będzie oczekiwać na pismo, by stać się kodem obowiązującym')) {
      values.firstAccept = true;

      try {
        const code = await saveCode({ ...values });

        setSnackbar({ children: 'Kod zapisany pomyślnie', severity: 'success' });
        editProposalMutation.mutate({ ...element, elementId: code.name, newValues: values });
        editProposalMutation.reset();
      } catch {
        setSnackbar({ children: 'Bład przy zapisywaniu kodu', severity: 'error' });
      }
    }
  };

  const resolveProposal = (proposal: Proposal | undefined) => async (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();

    if (!proposal) return setSnackbar({ children: 'Nieprawidłowa akcja', severity: 'error' });

    const selectedCodeToSave = proposal.newValues as ICode;

    if (!selectedCodeToSave) {
      return setSnackbar({ children: 'Brak kodu do zatwierdzenia lub inny błąd', severity: 'error' });
    }

    if (!proposal.letterNumber && !proposal.letterDate) {
      return setSnackbar({ children: 'Jedna z akcji nie ma numeru pisma lub jego daty - zatwierdzenie niemożliwe', severity: 'error' });
    }

    if (!window.confirm(`
        Jesteś pewny/-a, że chcesz zakończyć sprawę i wygenerować kod wraz z decyzją?
        Upewnij się, że do każdej wpłynęło pismo o przeksięgowanie 
        i wszystkie dane są prawidłowo wypełnione
      `)) return;

    const decision: Decision = {
      prefix: selectedCodeToSave.prefix,
      area: DecisionArea.Code,
      decisionId: '',
      decisionDate: '',
      target: selectedCodeToSave.locality,
      eventStartDate: selectedCodeToSave.startDate,
      eventEndDate: selectedCodeToSave.endDate,
      amount: selectedCodeToSave.amount,
      targetTeams: selectedCodeToSave.teams,
    };

    try {
      saveDecision(decision);
      await editCode({ ...selectedCodeToSave, id: proposal.elementId, letter: true });

      if (proposal.id) {
        // deleteProposalMutation.mutate(proposal.id);
        // deleteProposalMutation.reset();
        setSnackbar({ children: 'Operacja wykonana pomyślnie', severity: 'success' });
      } else {
        setSnackbar({ children: 'Wystąpił nieoczekiwany błąd przy usuwaniu propozycji', severity: 'error' });
      }
    } catch {
      setSnackbar({ children: 'Wystąpił nieoczekiwany błąd', severity: 'error' });
    }
  };

  const handleDeleteCodeProposal = (proposal: Proposal | undefined) => (event: { stopPropagation: () => void; }) => {
    if (!proposal) return setSnackbar({ children: 'Nieprawidłowa akcja', severity: 'error' });

    const { kind, id } = proposal;
    const code = proposal.newValues as ICode;

    if (kind === ProposalKind.Move) {
      window.alert(`
      Pamiętaj, że usunięcie akcji nie spowoduje przywrócenia członka. 
      Jeśli nastąpiła pomyłka, zwróć się z prośbą o cofnięcie zmiany
      do drużynowego drużyny docelowej lub administratora aplikacji.
      `);
    }

    if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć akcję? Spowoduje to także usunięcie kodu.')) return;

    if (id) {
      event.stopPropagation();
      deleteProposalMutation.mutate(id);
      deleteProposalMutation.reset();

      deleteCodeMutation.mutate(code?.id);
      deleteCodeMutation.reset();
    } else return setSnackbar({ children: 'Nieprawidłowy identyfikator akcji', severity: 'error' });
  };

  const handleCellEditCommit = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    const foundedAction: Proposal | undefined = props.rows.find((r) => r.id === id);

    // temporary workaround
    const proposalProps = [
      'letterNumber',
      'letterDate',
      'letterAuthor',
      'letterReceive',
    ];

    if (foundedAction) {
      if (proposalProps.includes(field)) {
        editProposalMutation.mutate({ ...foundedAction, [field]: value });
        editProposalMutation.reset();
      } else {
        const { newValues } = foundedAction;

        editProposalMutation.mutate({ ...foundedAction, newValues: { ...(newValues as ICode), [field]: value } });
        editProposalMutation.reset();
      }
    } else {
      setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
    }
  };

  const columns = [
    {
      field: 'event', headerName: 'Wydarzenie', editable: false, width: 150, ...columnAligning,
    },
    {
      field: 'responsiblePerson', headerName: 'Osoba odpowiedzialna', editable: false, width: 150, ...columnAligning,
    },
    {
      field: 'author', headerName: 'Zgłaszający', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
    },
    {
      field: 'amount', headerName: 'Kwota', editable: true, width: 100, ...columnAligning,
    },
    {
      field: 'startDate', headerName: 'Start imprezy', editable: true, type: 'date', width: 150, ...columnAligning,
    },
    {
      field: 'endDate', headerName: 'Koniec imprezy', editable: true, type: 'date', width: 150, ...columnAligning,
    },
    {
      field: 'locality', headerName: 'Organizowana w?', editable: true, width: 200, ...columnAligning,
    },
    {
      field: 'teams', headerName: 'Drużyny', width: 400, ...columnAligning,
    },
    {
      field: 'letterDate', headerName: 'Data pisma', editable: true, width: 150, type: 'date', ...columnAligning,
    },
    {
      field: 'letterAuthor', headerName: 'Autor pisma', editable: true, width: 300, ...columnAligning,
    },
    {
      field: 'letterNumber', headerName: 'Numer pisma', editable: props.isAdmin, width: 100, ...columnAligning,
    },
    {
      field: 'letterReceive', headerName: 'Data doręczenia', editable: props.isAdmin, width: 150, type: 'date', ...columnAligning,
    },
    {
      field: 'firstAccept', headerName: 'Akceptacja?', editable: false, width: 80, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      width: 100,
      align: 'center' as GridAlignment,
      headerAlign: 'center' as GridAlignment,
      getActions: ({ id } : { id: string }) => {
        const element = props.rows.find((el) => el.id === id);
        const values = element?.newValues as Omit<ICode, 'id'>;
        const teamNameToUse = !values.teams || values.teams.length > 1 ? '' : teamsMap.find((team) => team.teamId === values.teams[0])?.nameToUse;

        const firstAction = values.firstAccept && values.secondAccept 
          ?  (<GridActionsCellItem key="doneAll" icon={<VerifiedIcon />} color="inherit" label="verified" />) 
          : values.firstAccept
            ? (<GridActionsCellItem onClick={resolveProposal(element)} key="doneAll" icon={<DoneAllIcon />} color="inherit" label="resolve" />)
            : (<GridActionsCellItem onClick={firstAcceptHandler(element)} key="firstAccept" icon={<CheckIcon />} color="inherit" label="firstAccept" />);

        const actions = [
          <GridActionsCellItem
            key={id}
            icon={<CloseIcon />}
            label="Delete"
            onClick={handleDeleteCodeProposal(element)}
            color="inherit"
          />,
          <Letter
            key={id}
            recipient="Hufiec Ruda Śląska"
            area={ProposalArea.Code}
            kind={ProposalKind.Add}
            oldValues={element?.oldValues}
            newValues={{...values, teamNameToUse}}
            author={element?.letterAuthor}
            letterDate={element?.letterDate}
          />,
        ];

        if (props.isAdmin) {
          actions.unshift(firstAction);
        }

        return actions;
      },
    },
  ];

  return (
    <StyledDataGrid
      columns={columns}
      rows={props.rows.map((r) => {
        const newValues = r.newValues as Omit<ICode, 'id'>;

        return {
          id: r.id,
          event: `${newValues.prefix}${newValues.suffix ? `-${newValues.suffix}` : ''}`,
          responsiblePerson: `${newValues.responsiblePerson.name} ${newValues.responsiblePerson.surname}`,
          author: r.author,
          amount: newValues.amount,
          startDate: new Date(newValues.startDate).toLocaleDateString(),
          endDate: newValues.endDate ? new Date(newValues.endDate).toLocaleDateString() : '',
          locality: newValues.locality,
          teams: newValues.teams,
          letterNumber: r.letterNumber,
          letterDate: r.letterDate ? new Date(r.letterDate) : '',
          letterAuthor: r.letterAuthor,
          letterReceive: r.letterReceive ? new Date(r.letterReceive) : '',
          firstAccept: newValues.firstAccept,
          secondAccept: newValues.secondAccept,
        };
      })}
      onCellEditCommit={handleCellEditCommit}
      localeText={localizationDataGrid}
      getRowClassName={(params) => `super-app-theme--${params.row.secondAccept ? 'Filled' : params.row.firstAccept ? 'Open' : ''}`}
    />
  );
}

export default CodeProposal;
