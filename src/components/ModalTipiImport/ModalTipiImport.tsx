import { Modal, Box, TableRow, TableContainer, Table, Button, TableHead, Grid, Typography } from "@mui/material";
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

interface ModalImportPersonAccontStateProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalTipiImport = (props: ModalImportPersonAccontStateProps) => {
    // add reading csv file with imported data


    const { open, setOpen } = props;

    const [dbEntries, setDbEntries] = React.useState('');
    const [mappedRegistry, setMappedRegistry] = React.useState<Record<string, Person> | undefined>(undefined);

    const initAccountState = useSelector((state: RootState) => state.income.initAccount);
    const { data: registry } = useQuery('plain-registry', () => getPlainRegistry());

    const { setSnackbar } = useSnackbar();

    const mapRegistryNumber = async () => {
        const updatedRegistry = registry;

        for (const person in updatedRegistry) {
            const name = updatedRegistry[person].name;
            const surname = updatedRegistry[person].surname;

            const personAccount = initAccountState.find((el) => el.name?.toLowerCase() === name?.toLowerCase() && el.surname?.toLowerCase() === surname?.toLowerCase());

            if (personAccount) {
                updatedRegistry[person].evidenceNumber = personAccount.evidenceNumber;
            }

        }

        setMappedRegistry(updatedRegistry);
    }

    const updateData = async () => {
        console.log(mappedRegistry);

        if (!mappedRegistry) {
            setSnackbar({ children: 'Brak danych do zapisania', severity: 'error' });
            return
        };

        try {
            const data = await updatePlainRegistry(mappedRegistry);

            if (data) {
                setSnackbar({ children: 'Dane zaktualizowane', severity: 'success' });
            }

        } catch {
            setSnackbar({ children: 'Wystąpił błąd - odśwież', severity: 'error' });
        }
    };

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
            <Box p={4} overflow="hidden" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1200, height: 1000, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography textAlign="center" variant="h3">Mapowanie numerów ewidencji</Typography>
                <Box textAlign="center">
                    <Typography variant="h5">Wybierz plik z danymi</Typography>
                    <p>Dla bezpieczeństwa - wygeneruj kopię zapasową</p>
                    <p>Następnie przejrzyj dane, które wgrasz</p>
                    <p>Porzuć proces, jeśli coś się nie zgadza</p>
                </Box>
                <Box textAlign="center">
                    <Typography variant="h4">Zaimportowane dane</Typography>
                </Box>
                <Box>
                    <TableContainer style={{ maxHeight: 550 }}>
                        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>LP.</StyledTableCell>
                                    <StyledTableCell>Imię</StyledTableCell>
                                    <StyledTableCell>Nazwisko</StyledTableCell>
                                    <StyledTableCell>Drużyn</StyledTableCell>
                                    <StyledTableCell>Numer ewidencji</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {mappedRegistry ? Object.values(mappedRegistry).map((person, index) => (
                                <StyledTableRow key={person.evidenceNumber}>
                                    <StyledTableCell component="th">
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell>{person.name}</StyledTableCell>
                                    <StyledTableCell>{person.surname}</StyledTableCell>
                                    <StyledTableCell>{person.team}</StyledTableCell>

                                    <StyledTableCell>{person.evidenceNumber}</StyledTableCell>
                                </StyledTableRow>
                            )) : <></>}
                        </Table>
                    </TableContainer>
                </Box>
                <Grid container spacing={2} pt={4}>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={() => saveDbEntries()}>Generuj kopię zapasową</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="secondary" disabled={dbEntries.length === 0} onClick={() => downloadData()}>Pobierz backup</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="secondary" onClick={mapRegistryNumber}>Mapuj dane</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="secondary" disabled={!mappedRegistry} onClick={updateData}>Zapisz dane</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

export default ModalTipiImport;