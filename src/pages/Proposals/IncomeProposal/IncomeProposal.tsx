import EmailIcon from '@mui/icons-material/Email';
import { DataGrid, GridActionsCellItem, GridAlignment, GridCellEditCommitParams } from '@mui/x-data-grid';

import React from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { editProposal } from 'helpers/api-helpers/proposal';
import { Proposal } from 'models/global.enum';

import { IncomeDb } from 'models/income.models';
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
  
  const editProposalMutation = useMutation(editProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('proposal');
      setSnackbar({ children: 'Propozycja wyedytowana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu akcji', severity: 'error' });
    }
  });

  const columns = [
    { field: 'team', headerName: 'Drużyna', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'author', headerName: 'Zgłaszający', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'kind', headerName: 'Rodzaj', editable: false, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'title', headerName: 'Tytuł przelewu', editable: false, width: 300, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'oldValues', headerName: 'Obecne wartości', editable: false, width: 300, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'newValues', headerName: 'Nowe wartości', editable: false, width: 300, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'letterNumber', headerName: 'Numer pisma', editable: true, width: 200, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'letterAuthor', headerName: 'Autor pisma', editable: true, width: 400, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    // { field: 'dateOfDelete', headerName: 'Proponowana data usunięcia', editable: true, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    // { field: 'newTeam', headerName: 'Nowa drużyna', editable: true, width: 150, align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment },
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      width: 100, 
      align: 'center' as GridAlignment, headerAlign: 'center' as GridAlignment,
      getActions: ({ id } : { id: string }) => {
    
        // if (props.isAdmin) {
        //   return [
        //     <GridActionsCellItem
        //       key={id}
        //       icon={<CheckIcon />}
        //       label="Delete"
        //       onClick={handleResolveRegistryProposal(id)}
        //       color="inherit"
        //     />,
        //     <GridActionsCellItem
        //       key={id}
        //       icon={<CloseIcon />}
        //       label="Delete"
        //       onClick={handleDeleteRegistryProposal(id)}
        //       color="inherit"
        //     />,
        //   ];
        // }
    
        return [<GridActionsCellItem
          key={id}
          icon={<EmailIcon />}
          label="Pismo"
          //   onClick={() => console.log(id)}
          color="inherit"
        />];
    
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
        // rows={rows.map(r => { 
        //   return { ...r, id: r.id, evidenceNumber: r.evidenceNumber ?? '' };
        // })}
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
            letterAuthor: r.letterAuthor,
          };
        })}
        onCellEditCommit={handleCellEditCommit}
        localeText={localizationDataGrid}
        // components={{
        //   Toolbar: EditToolbar
        // }}
      />       
    </>
  );
};

export default IncomeProposal;
