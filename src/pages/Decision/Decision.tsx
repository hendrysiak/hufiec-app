import { Box, Typography } from '@mui/material';
import { DataGrid, GridCellEditCommitParams, GridCellProps, GridRenderCellParams } from '@mui/x-data-grid';
import React from 'react';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { editDecision, getDecisions } from 'helpers/api-helpers/decision';
import { codePattern } from 'helpers/event.helper';
import { useTeams } from 'helpers/hooks/useTeams';
import { Decision, DecisionCode, DecisionReAccouting, DecisionReturn } from 'models/decision.model';
import { DecisionArea } from 'models/global.enum';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { eventDateGenerator } from 'shared/eventDate.helper';
import { columnAligning } from 'shared/grid.helper';
import { localizationDataGrid } from 'shared/localization.helper';
import DecisionDownload from 'shared/PDF/Decision/DecisionDownload';

interface DecisionProps {
  isAdmin?: boolean;
}

const DecisionContainer = (props: DecisionProps) => {
  const query = useQuery<Decision[], Error>('decision', () => getDecisions());
  const teamsMap = useTeams();
  const queryClient = useQueryClient();

  const { setSnackbar } = useSnackbar();

  const edidDecisionMutation = useMutation(editDecision, {
    
    onSuccess: () => {
      queryClient.invalidateQueries('decision');
      setSnackbar({ children: 'Decyzja wyedytowana pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy edytowaniu decyzji', severity: 'error' });
    }
  });

  if (query.isLoading && !query.data) {
    return <h3>Ładowanie</h3>;
  }


  const handleCellEditCommit = (params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    const foundedDecision: Decision | undefined = query.data?.find(r => r.id === id);

    if (foundedDecision) {
      edidDecisionMutation.mutate({ ...foundedDecision, [field]: value });
      edidDecisionMutation.reset();
    } else {
      setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
    }
  };

  const columns = [
    { field: 'decisionId', headerName: 'Nr decyzji', editable: true, width: 150, ...columnAligning },
    { field: 'decisionDate', headerName: 'Data decyzji', type: 'date', editable: true, width: 150, ...columnAligning },
    { field: 'area', headerName: 'Obszar', editable: false, width: 150, ...columnAligning },
    { field: 'actionDescription', 
      headerName: 'Treść decyzji', 
      editable: false, 
      width: 1200, 
      // eslint-disable-next-line react/display-name
      renderCell: (params: GridRenderCellParams<string[]>) => (
        <div style={{ height: 156, overflowY: 'auto' }}>
          {params.value.map((el: string) => <Typography key={el}>{el}</Typography>)}
        </div>
      ),
      ...columnAligning, 
    },
    { field: 'actions', 
      type: 'actions',
      headerName: 'Akcje', 
      width: 100, 
      getActions: ({ id } : { id: string }) => {
        const element = query.data?.find(el => el.id === id);

        const actions = [
          <DecisionDownload
            key={id}
            recipient="Hufiec Ruda Śląska"
            decision={element as Decision}
          />
        ];   
    
        return actions;    
      }, 
      ...columnAligning
    },
  ];

  const generateCodeActionDescription = (decision: DecisionCode) => {
    const team = teamsMap.find(t => decision.targetTeams?.includes(t.teamId));
    const event = codePattern.find(code => code.value === decision.prefix)?.name;

    return [
      `Składka zadaniowa na kwotę ${decision.amount} zł`,
      `na ${event} ${team ? 'drużyny ' + team.nameToUse : ''}`,
      `${decision.target} w terminie ${eventDateGenerator(decision)}`
    ];
  };

  const generateReturnActionDescription = (decision: DecisionReturn) => {
    const returnsMap = decision.returnInfo.map(info => (`kwota: ${info.cash} z dnia ${info.date} tytułem: ${info.title}`));

    return [`Zwrot z powodu ${decision.reason} następujących wpłat:`, ...returnsMap];
  };

  const generateReAccountActionDescription = (decision: DecisionReAccouting) => {
    const reAccountMap = decision.reAccountingInfo?.map(info => (`kwota: ${info.cash} pismem ${info.letterNumber} na: ${info.targetCode}`));

    return ['Przeksięgowania następujących wpłat:', ...reAccountMap];
  };

  const actionDescriptionGenerator = (decision: Decision) => {
    let currentDecision: Decision | null = null;

    switch (decision.area) {
      case DecisionArea.Code:
        currentDecision = decision as DecisionCode;
        return generateCodeActionDescription(currentDecision);
      case DecisionArea.ReAccount:
        currentDecision = decision as DecisionReAccouting;
        return generateReAccountActionDescription(currentDecision);
      case DecisionArea.Return:
        currentDecision = decision as DecisionReturn;
        return generateReturnActionDescription(currentDecision);
    }


  };

  return (
    <main>
      <h1>Decyzje</h1>
      <Box
        sx={{
          height: '85vh',
          '& .justified': {
            maxWidth: '300px',
            color: 'green',
            textAlign: 'justify',
            wordWrap: 'break-word',
          }
        }}
      >
        <DataGrid
          columns={columns} 
          rows={query.data ? query.data.map((r: Decision) => {
            const actionDescription = actionDescriptionGenerator(r);


            return {
              id: r.id,
              area: r.area,
              decisionId: r.decisionId,
              decisionDate: new Date(r.decisionDate).toLocaleDateString(),
              actionDescription,

            };
          }) : []}
          onCellEditCommit={handleCellEditCommit}
          localeText={localizationDataGrid}
          rowHeight={156}
        // components={{
        //   Toolbar: EditToolbar
        // }}
        // checkboxSelection
        // onSelectionModelChange={(newSelectionModel) => {
        //   setSelectionModel(newSelectionModel);
        // }}
        // selectionModel={selectionModel}
        />   
      </Box>
    </main>
  );
};

export default DecisionContainer;
