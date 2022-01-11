import CheckIcon from '@mui/icons-material/Check';
import { Box, Button } from '@mui/material';
import { 
  DataGrid, 
  GridAlignment, 
  GridCellEditCommitParams, 
  GridSelectionModel, 
  GridToolbarContainer, 
} from '@mui/x-data-grid';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { deleteProposal, editProposal } from 'helpers/api-helpers/proposal';
import { editIncome, saveDecision } from 'helpers/editing-db.handler';
import { Decision, ReAccoutingInfo } from 'models/decision.model';
import { DecisionArea, ProposalArea, ProposalKind } from 'models/global.enum';

import { IncomeDb } from 'models/income.models';
import { Proposal } from 'models/proposal.models';
import Letter from 'pages/Letter/Letter';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { localizationDataGrid } from 'shared/localization.helper';

import { kindNameConverter } from '../helper';

interface IncomeProposalProps {
  isAdmin?: boolean;
  rows: Proposal[];
}

const IncomeProposal = (props: IncomeProposalProps): JSX.Element => {

  const { setSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
  
  const editProposalMutation = useMutation(editProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('proposal');
      setSnackbar({ children: 'Propozycja wyedytowana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu akcji', severity: 'error' });
    }
  });

  const deleteProposalMutation = useMutation(deleteProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('proposal');
      setSnackbar({ children: 'Propozycja rozwiązana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu akcji', severity: 'error' });
    }
  });

  const resolveProposal = async (selected: boolean) => {
    const today = new Date();
    const month = today.getUTCMonth();
    const year = today.getUTCFullYear();

    const selectedToReaccount = props.rows.filter(p => {
      if (!p.letterDate) return false;

      if (selected) {
        if (!p.id) return false;
        return selectionModel.includes(p.id);
      }

      const dateOfCreation = new Date(p.letterDate);
      const monthOfCreation = dateOfCreation.getUTCMonth();
      const yearOfCreation = dateOfCreation.getUTCFullYear();

      return yearOfCreation <= year && monthOfCreation <= month;
    });

    if (selectedToReaccount.length < 1) {
      return setSnackbar({ children: 'Brak przelewów do przeksięgowania', severity: 'error' });
    }

    if (selectedToReaccount.some(p => !p.letterNumber && !p.letterDate)) {
      return setSnackbar({ children: 'Jedna z akcji nie ma numeru pisma lub jego daty - przeksięgowanie niemożliwe', severity: 'error' });
    };
    
    if (!window.confirm(`
        Jesteś pewny/-a, że chcesz zakończyć sprawy ${selected ? 'zaznaczone' : 'z tego miesiąca'}?
        Upewnij się, że do każdej wpłynęło pismo o przeksięgowanie 
        i wszystkie dane są prawidłowo wypełnione
      `)) return;

    const reAccountingInfo: ReAccoutingInfo[] = selectedToReaccount.map(item => {
      const targetValues = item.newValues as IncomeDb;

      /**
       * Forcing these values is due to incorrect TS conversion
       */
      return {
        letterNumber: Number(item.letterNumber),
        cash: targetValues.cash,
        targetCode: `${targetValues.event}`,
      };

    });

    const decision: Decision = {
      area: DecisionArea.ReAccount,
      decissionId: '',
      decissionDate: '',
      reAccountingInfo,
    };

    
    try {
      saveDecision(decision);
      await Promise.all([
        ...selectedToReaccount.map(p => {
          return editIncome(p.newValues as IncomeDb);
          
        }),
        ...selectedToReaccount.map(p => {
          if (p.id) {
            deleteProposalMutation.mutate(p.id);
            deleteProposalMutation.reset();
          };
        }),
        editProposalMutation.mutate
      ]);
      setSnackbar({ children: 'Operacja wykonana pomyślnie', severity: 'success' });

    } catch {
      setSnackbar({ children: 'Wystąpił nieoczekiwany błąd', severity: 'error' });
    }

  };
  
  const EditToolbar = () => {
  
    if (props.isAdmin) {
      return (<Box display="flex">
        <GridToolbarContainer>
          <Button color="primary" startIcon={<CheckIcon />} onClick={() => resolveProposal(false)}>
            Przeksięguj przelewy z tego miesiąca
          </Button>
        </GridToolbarContainer>
        <GridToolbarContainer>
          <Button color="primary" startIcon={<CheckIcon />} onClick={() => resolveProposal(true)}>
            Przeksięguj przelewy zaznaczone
          </Button>
        </GridToolbarContainer>,
      </Box>
      );
    }

    return <></>;
  };

  const columnAligning = {
    align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment
  };


  const columns = [
    { field: 'team', headerName: 'Drużyna', editable: false, width: 150, ...columnAligning },
    { field: 'author', headerName: 'Zgłaszający', editable: false, width: 150, ...columnAligning },
    { field: 'kind', headerName: 'Rodzaj', editable: false, width: 100, ...columnAligning },
    { field: 'title', headerName: 'Tytuł przelewu', editable: false, width: 300, ...columnAligning },
    { field: 'oldValues', headerName: 'Obecne wartości', editable: false, width: 250, ...columnAligning },
    { field: 'newValues', headerName: 'Nowe wartości', editable: false, width: 250, ...columnAligning },
    { field: 'letterNumber', headerName: 'Numer pisma', editable: props.isAdmin && true, width: 100, ...columnAligning },
    { field: 'letterDate', headerName: 'Data pisma', editable: props.isAdmin && true, width: 200, type: 'date', ...columnAligning },
    { field: 'letterAuthor', headerName: 'Autor pisma', editable: true, width: 400, ...columnAligning },
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      width: 100, 
      align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
      getActions: ({ id } : { id: string }) => {
        const element = props.rows.find(el => el.id === id);

        const actions = [
          <Letter
            key={id}
            recipient="Hufiec Ruda Śląska"
            area={ProposalArea.Income}
            kind={ProposalKind.Edit}
            oldValues={element?.oldValues}
            newValues={element?.newValues}
            author={element?.letterAuthor}
          />
        ];   
    
        return actions;    
      }, },
  ];

  const handleCellEditCommit = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    const foundedAction: Proposal | undefined = props.rows.find(r => r.id === id);

    if (foundedAction) {
      editProposalMutation.mutate({ ...foundedAction, [field]: value });
      editProposalMutation.reset();
    } else {
      setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
    }
  };
    
  return (
    <>
      <DataGrid
        columns={columns} 
        rows={props.rows.map(r => {
          const currentValues = r.oldValues as IncomeDb;
          const newValues = r.newValues as IncomeDb;

          return {
            id: r.id,
            team: r.team,
            author: r.author,
            kind: kindNameConverter(r.kind),
            title: currentValues.title,
            oldValues: `${currentValues.name ?? 'BRAK'}, ${currentValues.surname ?? 'BRAK'}, ${currentValues.event ?? 'BRAK'}, ${currentValues.team ?? 'BRAK'}`,
            newValues: `${newValues.name}, ${newValues.surname}, ${newValues.event}, ${newValues.team}`,
            letterNumber: r.letterNumber,
            letterDate: r.letterDate ? new Date(r.letterDate) : '',
            letterAuthor: r.letterAuthor,
          };
        })}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        components={{
          Toolbar: EditToolbar
        }}
        checkboxSelection
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
      />       
    </>
  );
};

export default IncomeProposal;
