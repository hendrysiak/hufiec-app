import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { Button } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridCellEditCommitParams, GridRenderCellParams, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

import React from 'react';

import { useTeams } from 'helpers/hooks/useTeams';
import { checkColumnRenderer } from 'helpers/render/checkColumnRenderer';
import { BudgetEntry, FinanceMethod, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { IncomeDb, OutcomeDb } from 'models/income.models';
import { columnAligning } from 'shared/grid.helper';
import { localizationDataGrid } from 'shared/localization.helper';

import { ErrorCheckboxesViewCell, ErrorCheckboxesEditCell } from './ErrorCell/ErrorCell';

interface BudgetDataGridProps {
  displayedIncome: IncomeDb[];
  displayedOutcome: OutcomeDb[];
  editedData: BudgetEntry;
  handleCellEditCommit: (params: GridCellEditCommitParams) => Promise<void>
  addNewPosition: () => void;
  handleDeleteBudgetEntry: (entryId: string) => (event: {
    stopPropagation: () => void;
  }) => Promise<void>
};


const BudgetDataGrid = (props: BudgetDataGridProps): JSX.Element => {
  const teamsMap = useTeams();
  const availableTeams = teamsMap.map(t => t.teamId);


  const incomeColumn = [
    { field: 'lp', headerName: 'LP.', width: 50, ...columnAligning },
    { field: 'year', headerName: 'Rok', editable: true, width: 100, ...columnAligning },
    { field: 'cash', headerName: 'Kwota', editable: true, width: 100, ...columnAligning },
    { field: 'surname', headerName: 'Nazwisko', editable: true, width: 150, ...columnAligning },
    { field: 'name', headerName: 'Imię', editable: true, width: 150, ...columnAligning },
    { field: 'team', headerName: 'Drużyna', editable: true, type: 'singleSelect', valueOptions: availableTeams, width: 100, ...columnAligning },
    { field: 'event', headerName: 'Kod', editable: true, width: 100, ...columnAligning },
    { field: 'title', headerName: 'Tytuł', width: 500, ...columnAligning },
    { field: 'dateOfBook', headerName: 'Data przelewu', type: 'date', width: 150, ...columnAligning, renderCell: (params: GridRenderCellParams<string>) => (<div>{new Date(`${params?.value}`)?.toLocaleDateString()}</div>) },
    { field: 'importDate', headerName: 'Data importu', type: 'date', width: 150, ...columnAligning, renderCell: (params: GridRenderCellParams<string>) => (<div>{new Date(`${params?.value}`)?.toLocaleDateString()}</div>) },
    { field: 'letterReceived', headerName: 'Pismo', editable: true, type: 'boolean', width: 80, ...columnAligning, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params) },
    { field: 'dateOfLetter', headerName: 'Data pisma', editable: true, type: 'date', width: 150, ...columnAligning, renderCell: (params: GridRenderCellParams<string | undefined>) => (<div>{params?.value ? new Date(params.value).toLocaleDateString() : ''}</div>) },
    { field: 'comment', headerName: 'Komentarz', editable: true, width: 400, ...columnAligning },
    { field: 'errors', headerName: 'Błedy', width: 400, ...columnAligning, editable: true, renderCell: (params: GridRenderCellParams<string>) => <ErrorCheckboxesViewCell params={params}/>, renderEditCell: (params: GridRenderCellParams<string>) => <ErrorCheckboxesEditCell params={params} /> },
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      width: 100, 
      getActions: ({ id } : { id: string }) => {
    
        const actions = [
          <GridActionsCellItem
            key={id}
            icon={<CloseIcon />}
            label="Delete"
            onClick={props.handleDeleteBudgetEntry(id)}
            color="inherit"
          />
        ];   
        
        return actions;    
      }, 
      ...columnAligning
    },
  ];

  const outcomeColumn = [
    { field: 'lp', headerName: 'LP.', width: 50, ...columnAligning },
    { field: 'year', headerName: 'Rok', editable: true, width: 100, ...columnAligning },
    { field: 'financeMethod', headerName: 'Kategoria wydatku', editable: true, width: 80, ...columnAligning, type: 'singleSelect', valueOptions: Object.values(FinanceMethod) },
    { field: 'cash', headerName: 'Kwota', editable: true, width: 100, ...columnAligning },
    { field: 'bilingNr', headerName: 'NR F-ry', editable: true, width: 100, ...columnAligning },
    { field: 'team', headerName: 'Drużyna', editable: true, width: 100, type: 'singleSelect', valueOptions: availableTeams, ...columnAligning },
    { field: 'event', headerName: 'Kod', editable: true, width: 100, ...columnAligning },
    { field: 'title', headerName: 'Tytuł', width: 500, ...columnAligning },
    { field: 'dateOfBook', headerName: 'Data przelewu', type: 'date', width: 150, ...columnAligning, renderCell: (params: GridRenderCellParams<string | undefined>) => (<div>{params.value ? new Date(params.value).toLocaleDateString() : ''}</div>) },
    { field: 'importDate', headerName: 'Data importu', type: 'date', width: 150, ...columnAligning, renderCell: (params: GridRenderCellParams<string | undefined>) => (<div>{params.value ? new Date(params.value).toLocaleDateString() : ''}</div>) },
    { field: 'foundingSource', headerName: 'Sposób finansowania', editable: true, width: 150, ...columnAligning, type: 'singleSelect', valueOptions: Object.values(FoundingSources), },
    { field: 'outcomeCategory', headerName: 'Kategoria wydatku', editable: true, width: 150, ...columnAligning, type: 'singleSelect', valueOptions: Object.values(OutcomeCategory) },
    { field: 'comment', headerName: 'Komentarz', editable: true, width: 400, ...columnAligning },
    { field: 'errors', headerName: 'Błedy', width: 400, ...columnAligning },
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      width: 100, 
      getActions: ({ id } : { id: string }) => {
    
        const actions = [
          <GridActionsCellItem
            key={id}
            icon={<CloseIcon />}
            label="Delete"
            onClick={props.handleDeleteBudgetEntry(id)}
            color="inherit"
          />
        ];   
        
        return actions;    
      }, 
      ...columnAligning
    },
  ];


  const incomeRows = props.displayedIncome.map((income: IncomeDb, index: number) => {
    return {
      lp: index + 1,
      id: income.id,
      year: income.year,
      cash: income.cash,
      surname: income.surname,
      name: income.name,
      team: income.team,
      event: income.event,
      title: income.title,
      dateOfBook: income.dateOfBook,
      importDate: income.importDate,
      letterReceived: income.letterReceived,
      dateOfLetter:income.dateOfLetter ? new Date(income.dateOfLetter) : '',
      comment: income.comment,
      errors: income?.errors ? income.errors.join(',') : '',
    };
  });

  const outcomeRows = props.displayedOutcome.map((outcome: OutcomeDb, index: number) => {
    return {
      lp: index + 1,
      id: outcome.id,
      year: outcome.year,
      financeMethod: outcome.financeMethod,
      cash: outcome.cash,
      bilingNr: outcome.bilingNr,
      team: outcome.team,
      event: outcome.event,
      title: outcome.title,
      dateOfBook: outcome.dateOfBook,
      importDate: outcome.importDate,
      foundingSource: outcome.foundingSource,
      outcomeCategory: outcome.outcomeCategory,
      comment: outcome.comment,
      errors: outcome?.errors ? outcome.errors.join(', ') : '',
    };
  });

  const EditToolbar = () => {
  
    const handleClick = () => props.addNewPosition();
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Dodaj rekord
        </Button>
        <GridToolbarExport csvOptions={{
          utf8WithBom: true
        }} />
      </GridToolbarContainer>
    );
  };


  return props.editedData === BudgetEntry.Income ? <DataGrid
    columns={incomeColumn} 
    rows={incomeRows}
    onCellEditCommit={props.handleCellEditCommit}
    localeText={localizationDataGrid}
    // rowHeight={156}
    components={{
      Toolbar: EditToolbar
    }}
    // checkboxSelection
    // onSelectionModelChange={(newSelectionModel) => {
    //   setSelectionModel(newSelectionModel);
    // }}
    // selectionModel={selectionModel}
  />   
    : <DataGrid
      columns={outcomeColumn} 
      rows={outcomeRows}
      onCellEditCommit={props.handleCellEditCommit}
      localeText={localizationDataGrid}
      // rowHeight={156}
      components={{
        Toolbar: EditToolbar
      }}
    // checkboxSelection
    // onSelectionModelChange={(newSelectionModel) => {
    //   setSelectionModel(newSelectionModel);
    // }}
    // selectionModel={selectionModel}
    />;   

};


export default BudgetDataGrid;