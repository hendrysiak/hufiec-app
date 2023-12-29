import { Modal, Box, TableRow, TableContainer, Table, Button, Typography, TableHead, Grid } from "@mui/material";
import { saveAllAccountsStates } from "helpers/api-helpers/account";
import { createBackup } from "helpers/editing-db.handler";
import { useTeams } from "helpers/hooks/useTeams";
import { StyledTableCell, StyledTableRow } from "helpers/render/StyledTableElements";
import { getContentFromCSV } from "helpers/utils/getContentFromCSV";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import React from "react";
import { useQuery } from "react-query";

interface ModalImportTeamAccountStateProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const getProperJSONfromCSVContent = (content: any[]) => {

    const object: Record<string, number> = {};

    content.forEach((row) => {
        const key = row["Drużyna"];
        const value = row["Stan konta"].replace(" zł", "").replace(" ", "").replace(",", ".");
        const parsedValue = Number(value);

        if (!object[`${key}`]) {
            object[`${key}`] = isNaN(parsedValue) ? 0 : parsedValue;
        } else {
            object[`${key}`] = isNaN(parsedValue) ? 0 : parsedValue
        }
    })

    return object
};


const ModalImportTeamAccountState = (props: ModalImportTeamAccountStateProps) => {
    const { open, setOpen } = props;
    const [file, setFile] = React.useState<File | null>(null);
    const [dbEntries, setDbEntries] = React.useState('');
    const teamsMap = useTeams();

    const { setSnackbar } = useSnackbar();

    const fileContent = useQuery('teamAccount', async () => {
        if (!file) return;
        const csvContent = await getContentFromCSV(file);
        return getProperJSONfromCSVContent(csvContent);
    }, {
        enabled: file !== null,
    });

    const updateData = async () => {
        if (!fileContent.data) return;

        if (window.confirm('Czy na pewno chcesz zaimportować dane?')) {
            try {
                await saveAllAccountsStates(fileContent.data);
                setSnackbar({ children: 'Stan kont zapisany pomyślnie', severity: 'success' });
            } catch {
                setSnackbar({ children: 'Wystąpił błąd - odśwież', severity: 'error' });
            }
        }
    }

    const saveDbEntries = async () => {
        const entries = await createBackup();
        setDbEntries(entries);
    }

    const downloadData = () => {
        var a = document.createElement("a");
        var file = new Blob([dbEntries], { type: "application/json" });
        a.href = URL.createObjectURL(file);
        a.download = 'finance-zhprsl-export.json';
        a.click();
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box p={4} overflow="hidden" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1000, height: 1000, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography textAlign="center" variant="h3">Import stanów kont drużyn</Typography>
                <Box textAlign="center">
                    <Typography variant="h5">Wybierz plik z danymi</Typography>
                    <p>WAŻNE! Plik powinien być w formacie CSV i posiadać dwie kolumny - "Drużyna" oraz "Stan konta". Inne pliki spowodują błąd formatowania</p>
                    <p>Pamiętaj, żeby zapisać plik w formacie CSV UTF-8</p>
                    <p>Dla bezpieczeństwa - wygeneruj też kopię zapasową</p>
                </Box>
                <Box py={4}>
                    <input type="file" accept=".csv" onChange={
                        (e) => {
                            if (e.target.files) {
                                setFile(e.target.files[0]);
                            }
                        }
                    } />
                </Box>
                <Box textAlign="center">
                    <Typography variant="h4">Zaimportowane dane</Typography>
                </Box>
                <Box>
                    <TableContainer style={{ maxHeight: 550 }}>
                        <Table sx={{ minWidth: 500 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Drużyna</StyledTableCell>
                                    <StyledTableCell>Pełna nazwa</StyledTableCell>
                                    <StyledTableCell align="right">Stan konta</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {Object.entries(fileContent.data ?? {})?.map(([key, value]) => (
                                <StyledTableRow key={key}>
                                    <StyledTableCell component="th" scope="row">
                                        {key}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {teamsMap.find((team) => team.teamId === Number(key))?.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">{value}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </Table>
                    </TableContainer>
                </Box>
                <Grid container spacing={2} pt={4}>
                    <Grid item xs={4}>
                        <Button variant="contained" color="primary" onClick={() => saveDbEntries()}>Generuj kopię zapasową</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" color="secondary" disabled={dbEntries.length === 0} onClick={() => downloadData()}>Pobierz backup</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={updateData}>Zapisz dane</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default ModalImportTeamAccountState;