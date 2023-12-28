import { Box } from "@mui/material";
import { DataGrid, GridCellEditCommitParams, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { saveAccountState } from "helpers/api-helpers/account";
import { useTeams } from "helpers/hooks/useTeams";
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
    const teamsAccounts = useSelector((state: RootState) => state.income.teamAccounts);

    const { setSnackbar } = useSnackbar();

    const columns = [
        { field: 'teamId', headerName: 'Id drużyny', width: 150 },
        { field: 'teamName', headerName: 'Nazwa drużyny', width: 500 },
        { field: 'accountBalance', headerName: 'Saldo konta', width: 150, editable: true },
    ];

    const rows = teamsMap.map((team) => {
        const teamAccount = teamsAccounts?.[team.teamId];
        return {
            id: team.teamId,
            teamId: team.teamId,
            teamName: team.name,
            accountBalance: teamAccount ?? 0,
        }
    });

    const handleCellEditCommit = async (params: GridCellEditCommitParams) => {
        const { id, value } = params;

        console.log(params);

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