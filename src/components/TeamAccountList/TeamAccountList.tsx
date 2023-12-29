import { Box } from "@mui/material";
import { DataGrid, GridCellEditCommitParams, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { saveAccountState } from "helpers/api-helpers/account";
import { useTeams } from "helpers/hooks/useTeams";
import { getAccountStateForTeam } from "helpers/utils/getAccountStateForTeam";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import { useSelector } from "react-redux";
import { localizationDataGrid } from "shared/localization.helper";
import { RootState } from "store/models/rootstate.model";

function ExportToolbar() {

    return (
      <GridToolbarContainer>
        <GridToolbarExport csvOptions={{
          utf8WithBom: true,
        }}
        />
      </GridToolbarContainer>
    );
  }

const TeamAccountList = () => {
    const teamsMap = useTeams();

    const { setSnackbar } = useSnackbar();

    const columns = [
        { field: 'teamId', headerName: 'Id drużyny', width: 150 },
        { field: 'teamName', headerName: 'Nazwa drużyny', width: 500 },
        { field: 'accountBalance', headerName: 'Saldo konta początkowe', width: 250, editable: true },
        { field: 'sumOfAcountsBalances', headerName: 'Stan finansów', width: 150, editable: false },
    ];

    const rows = teamsMap.map((team) => {

        const { teamAccountState, sumOfFeesForTeam, teamAccountOutcome } = getAccountStateForTeam(`${team.teamId}`)

        return {
            id: team.teamId,
            teamId: team.teamId,
            teamName: team.name,
            accountBalance: teamAccountState,
            sumOfAcountsBalances: teamAccountState + Number((sumOfFeesForTeam ? sumOfFeesForTeam / 5 : 0).toFixed(2)) - teamAccountOutcome
        }
    });

    const handleCellEditCommit = async (params: GridCellEditCommitParams) => {
        const { id, value } = params;

        try {
            await saveAccountState(value, `${id}`);
            setSnackbar({ children: 'Stan konta wyedytowany pomyślnie', severity: 'success' });
        } catch {
            setSnackbar({ children: 'Wystąpił błąd - odśwież', severity: 'error' });
        }
      };

    return (
        <Box height="90vh">
        <DataGrid
            rows={rows}
            columns={columns}
            localeText={localizationDataGrid}
            onCellEditCommit={handleCellEditCommit}
            components={{
                Toolbar: ExportToolbar,
            }}
        />
        </Box>)
};

export default TeamAccountList;