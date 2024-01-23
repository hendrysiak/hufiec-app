import { Modal, Box, TableRow, TableContainer, Table, Button, TableHead, Grid, Typography, IconButton } from "@mui/material";
import { createBackup } from "helpers/editing-db.handler";
import { useTeams } from "helpers/hooks/useTeams";
import { StyledTableCell, StyledTableRow } from "helpers/render/StyledTableElements";
import { getPlainRegistry, updatePlainRegistry } from "helpers/api-helpers/account.handler";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import React from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";
import { Person } from "models/registry.models";
import CloseIcon from '@mui/icons-material/Close';
import InputFileUpload from "components/InputFileUpload/InputFileUpload";
import { getContentFromCSV } from "helpers/utils/getContentFromCSV";
import stripBom from "strip-bom";
import { contains } from "helpers/utils/contains";
import { StyledDataGrid } from "shared/StyledDataGrid/StyledDataGrid";
import { te } from "date-fns/locale";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { localizationDataGrid } from "shared/localization.helper";
import { countingMemberFee } from "helpers/member-fee.helper";

interface ModalImportPersonAccontStateProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditToolbar() {

    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={{
                utf8WithBom: true,
                fileName: 'Lista na event.csv',
                delimiter: ';',
                fields: [
                    'event',
                    'name',
                    'surname',
                    'team',
                    'evidenceNumber',
                    'income',
                    'feeState',
                ]
            }}
            />
        </GridToolbarContainer>
    );
}

const ModalEventListGenerator = (props: ModalImportPersonAccontStateProps) => {
    const { open, setOpen } = props;
    const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);

    const { data: registry } = useQuery('plain-registry', () => getPlainRegistry());

    const handleClose = () => {
        setOpen(false);
    };

    const columns = [
        { field: 'event', headerName: 'Kod', width: 150, },
        { field: 'name', headerName: 'Imię', width: 150, },
        { field: 'surname', headerName: 'Nazwisko', width: 150, },
        { field: 'team', headerName: 'Drużyna', width: 150, },
        { field: 'evidenceNumber', headerName: 'Numer ewidencji', width: 150, },
        { field: 'title', headerName: 'Tytuł przelewu', width: 350, },
        { field: 'income', headerName: 'Wpłata', width: 150, },
        { field: 'feeState', headerName: 'Składki', width: 150, },
    ];

    const rows = React.useMemo(() => dbIncomes.filter(income => income.event !== 'SC').map((income, index) => {

        if (!registry) return [];

        let fee = 0;
        let evidenceNumber = 'Brak';

        const personInApplication = Object.entries(registry).find(([id, personInApp]) => income.name?.toLowerCase() === personInApp.name?.toLowerCase() && income.surname?.toLowerCase() === personInApp.surname?.toLowerCase());

        if (personInApplication) {
            evidenceNumber = personInApplication[1]?.evidenceNumber ?? 'Brak';

            fee = countingMemberFee(personInApplication[1]);
        }

        return {
            id: income.id,
            event: income.event,
            name: income.name,
            surname: income.surname,
            team: income.team,
            evidenceNumber,
            title: income.title,
            income: income.cash,
            feeState: fee,
        }
    }) ?? [], [registry]);

    if (!registry) return null;

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box p={4} overflow="hidden" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "100vw", height: "100vh", bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography textAlign="center" variant="h3">Generator list na imprezy</Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box py={4} display="flex" justifyContent="space-between">
                    <Box>
                        <p>Wyfiltruj właściwą imprezę i posortuj według potrzeby</p>
                    </Box>
                </Box>
                <Box textAlign="center">
                    <Typography variant="h4">Wygenerowana lista</Typography>
                </Box>
                <Box height="70%">
                    <StyledDataGrid
                        columns={columns}
                        rows={rows}
                        // getRowClassName={(params) => `super-app-theme--${params.row.error === PersonError.TEAM ? 'PartiallyFilled' : params.row.error === PersonError.NON_EXIST ? 'Rejected' : ''}`
                        // }
                        components={{
                            Toolbar: EditToolbar,
                        }}
                        localeText={localizationDataGrid}
                    />
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalEventListGenerator;