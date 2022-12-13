import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';

import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';

import { deleteCode, getCodes, saveCode } from 'helpers/api-helpers/codes';
import { checkColumnRenderer } from 'helpers/render/checkColumnRenderer';
import { ICode } from 'models/codes.models';

import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { columnAligning } from 'shared/grid.helper';
import { localizationDataGrid } from 'shared/localization.helper';

function CodeExplorer(): JSX.Element {
  const query = useQuery<ICode[], Error>('codes', () => getCodes());
  const queryClient = useQueryClient();

  const { setSnackbar } = useSnackbar();

  const deleteCodeMutation = useMutation(deleteCode, {

    onSuccess: () => {
      queryClient.invalidateQueries('codes');
      setSnackbar({ children: 'Kod usunięty pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy usuwaniu kodu', severity: 'error' });
    },
  });

  const handleDeleteCode = (code: ICode | undefined) => (event: { stopPropagation: () => void; }) => {
    if (!code) {
      window.alert(`
      Brak kodu do usunięcia lub nieprawidłowy kod.
      `);
    }

    if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć kod?')) return;
    event.stopPropagation();
    if (code?.id) {
      deleteCodeMutation.mutate(code?.id);
      deleteCodeMutation.reset();
    } else {
      return setSnackbar({ children: 'Wystąpił nieoczekiwany błąd przy usuwaniu kodu', severity: 'error' });
    }
  };

  const columns = [
    {
      field: 'lp', headerName: 'LP.', width: 50, ...columnAligning,
    },
    {
      field: 'event', headerName: 'Kod', width: 150, ...columnAligning,
    },
    {
      field: 'responsiblePerson', headerName: 'Osoba odpowiedzialna', width: 200, ...columnAligning,
    },
    {
      field: 'startDate', headerName: 'Data rozpoczęcia', width: 150, ...columnAligning,
    },
    {
      field: 'endDate', headerName: 'Data zakończenia', width: 150, ...columnAligning,
    },
    {
      field: 'locality', headerName: 'Organizowana w?', width: 150, ...columnAligning,
    },
    {
      field: 'wholeOrganization', headerName: 'Kod hufcowy?', width: 80, ...columnAligning, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    {
      field: 'teams', headerName: 'Drużyny przypisane do kodu', width: 300, ...columnAligning,
    },
    {
      field: 'firstAccept', headerName: 'Akceptacja?', width: 80, ...columnAligning, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    {
      field: 'letter', headerName: 'Pismo?', width: 80, ...columnAligning, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    {
      field: 'decision', headerName: 'Nr decyzji?', width: 80, ...columnAligning, renderCell: (params: GridRenderCellParams<string | boolean | undefined>) => checkColumnRenderer(params),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Akcje',
      width: 100,
      getActions: ({ id } : { id: string }) => {
        const element = query.data?.find((el) => el.id === id);

        const deleteAction = element?.prefix === 'SC'
          ? <></>
          : (
            <GridActionsCellItem
              key={id}
              icon={<CloseIcon />}
              label="Delete"
              onClick={handleDeleteCode(element)}
              color="inherit"
            />
          );

        const actions = [
          deleteAction,
        ];

        return actions;
      },
      ...columnAligning,
    },
  ];

  return (
    <main style={{ height: '92vh' }}>
      <DataGrid
        columns={columns}
        rows={(query?.data || []).map((c: ICode, index) => ({
          id: c.id,
          lp: index + 1,
          event: c.suffix ? `${c.prefix}-${c.suffix}` : c.prefix,
          responsiblePerson: `${c.responsiblePerson?.surname} ${c.responsiblePerson?.name}`,
          startDate: new Date(c.startDate).toLocaleDateString(),
          endDate: c.endDate ? new Date(c.endDate).toLocaleDateString() : new Date(c.startDate).toLocaleDateString(),
          locality: c.locality || '',
          wholeOrganization: c.wholeOrganization,
          teams: c.teams ? c.teams.join(',') : '',
          firstAccept: c.firstAccept,
          letter: c.letter,
          decision: c.decision,
        }))}
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
      />
    </main>
  );
}

export default CodeExplorer;
