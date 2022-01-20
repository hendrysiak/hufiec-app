import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';

import React from 'react';

import { checkColumnRenderer } from 'helpers/render/checkColumnRenderer';
import { IncomeDb } from 'models/income.models';
import { columnAligning } from 'shared/grid.helper';
import { localizationDataGrid } from 'shared/localization.helper';

interface BudgetDataGridProps {

  displayedIncome: IncomeDb[];
  editedData:
}


const BudgetDataGrid = (props: BudgetDataGridProps): JSX.Element => {


  const incomeColumn = [
    { field: 'lp', headerName: 'LP.', width: 50, ...columnAligning },
    { field: 'year', headerName: 'Rok', editable: true, width: 100, ...columnAligning },
    { field: 'cash', headerName: 'Kwota', editable: true, width: 100, ...columnAligning },
    { field: 'surname', headerName: 'Nazwisko', editable: true, width: 150, ...columnAligning },
    { field: 'name', headerName: 'Imię', editable: true, width: 150, ...columnAligning },
    { field: 'team', headerName: 'Drużyna', editable: true, width: 100, ...columnAligning },
    { field: 'event', headerName: 'Kod', editable: true, width: 100, ...columnAligning },
    { field: 'title', headerName: 'Tytuł', width: 200, ...columnAligning },
    { field: 'dateOfBook', headerName: 'Data przelewu', type: 'date', width: 150, ...columnAligning },
    { field: 'importDate', headerName: 'Data importu', type: 'date', width: 150, ...columnAligning },
    { field: 'letterReceived', headerName: 'Pismo', width: 80, ...columnAligning, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params) },
    { field: 'dateOfLetter', headerName: 'Data pisma', type: 'date', width: 150, ...columnAligning },
    { field: 'comment', headerName: 'Komentarz', width: 200, ...columnAligning },


    // { field: 'actions', 
    //   type: 'actions',
    //   headerName: 'Akcje', 
    //   width: 100, 
    //   getActions: ({ id } : { id: string }) => {
    //     const element = query.data?.find(el => el.id === id);
    
    //     const deleteAction = element?.prefix === 'SC' 
    //       ? <></> 
    //       : (<GridActionsCellItem
    //         key={id}
    //         icon={<CloseIcon />}
    //         label="Delete"
    //         onClick={handleDeleteCode(element)}
    //         color="inherit"
    //       />);
    
    //     const actions = [
    //       deleteAction
    //     ];   
        
    //     return actions;    
    //   }, 
    //   ...columnAligning
    // },
  ];


  const incomeRows = props.displayedIncome.map((income: IncomeDb) => {
    return {
      id: income.id,
      year: income.year,
      cash: income.cash,
      surname: income.surname,
      name: income.name,
      team: income.team,
      event: income.event,
      title: income.title,
      dateOfBook: new Date(income.dateOfBook).toLocaleDateString(),
      importDate: new Date(income.importDate).toLocaleDateString(),
      letterReceived: income.letterReceived,
      dateOfLetter:income.dateOfLetter ? new Date(income.dateOfLetter) : '',
      comment: income.comment
    };
  });


  return <DataGrid
    columns={incomeColumn} 
    rows={displayedIncome.map((income: IncomeDb) => {
      return {
        id: income.id,
        year: income.year,
        cash: income.cash,
        surname: income.surname,
        name: income.name,
        team: income.team,
        event: income.event,
        title: income.title,
        dateOfBook: new Date(income.dateOfBook).toLocaleDateString(),
        importDate: new Date(income.importDate).toLocaleDateString(),
        letterReceived?: income.letterReceived,
        dateOfLetter:income.dateOfLetter ? new Date(income.dateOfLetter) : '',
        comment: income.comment
      };
    })}
    // onCellEditCommit={handleCellEditCommit}
    localeText={localizationDataGrid}
    // rowHeight={156}
    // components={{
    //   Toolbar: EditToolbar
    // }}
    // checkboxSelection
    // onSelectionModelChange={(newSelectionModel) => {
    //   setSelectionModel(newSelectionModel);
    // }}
    // selectionModel={selectionModel}
  />;   

};


export default BudgetDataGrid;