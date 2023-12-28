import { Modal, Box, TableCell, tableCellClasses, styled, TableRow, TableContainer, Table, Button, TableHead, Grid, Typography } from "@mui/material";
import { createBackup } from "helpers/editing-db.handler";
import { useTeams } from "helpers/hooks/useTeams";
import { getContentFromCSV } from "helpers/utils/getContentFromCSV";
import { setInitAccountState } from "pages/DashBoard/api-handlers/account.handler";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import React from "react";
import { useQuery } from "react-query";

interface ModalImportPersonAccontStateProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgba(54, 33, 94, 1)',
        color: theme.palette.common.white,
        fontSize: 24,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 24,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        fontSize: 24,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const getProperJSONfromCSVContent = (content: any[]) => {

    console.log(content);

    const array: any[] = [];

    content.forEach((row) => {
        const surname = row["surname"];
        const name = row["name"];
        const team = row["team"];
        const balance = row["feeState"].replace(" zł", "").replace(" ", "").replace(",", ".");
        const year = new Date().getFullYear();
        const evidenceNumber = row["nr ewidencyjny"];
        //! It's temporary - reploace this logic with real orgNumber after migration
        const orgNumber = "6671";
        const parsedBalance = Number(balance);

        array.push({
            surname,
            name,
            team,
            balance: isNaN(parsedBalance) ? 0 : parsedBalance,
            year,
            evidenceNumber,
            orgNumber,
        })
    })

    return array
};


const ModalImportPersonAccontState = (props: ModalImportPersonAccontStateProps) => {
    const { open, setOpen } = props;
    const [file, setFile] = React.useState<File | null>(null);
    const [dbEntries, setDbEntries] = React.useState('');
    const teamsMap = useTeams();

    const { setSnackbar } = useSnackbar();

    const fileContent = useQuery('personAccount', async () => {
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
                await setInitAccountState(fileContent.data);
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
            <Box p={4} overflow="hidden" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 1200, height: 1200, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography textAlign="center" variant="h3">Import stanów kont osób</Typography>
                <Box textAlign="center">
                    <Typography variant="h5">Wybierz plik z danymi</Typography>
                    <p>WAŻNE! Plik powinien być w formacie CSV i posiadać dwie kolumny - "surname", "name", "team", "feeState" oraz "nr ewidencyjny". Inne pliki spowodują błąd formatowania</p>
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
                    <TableContainer style={{ maxHeight: 750 }}>
                        <Table sx={{ minWidth: 1000 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>LP.</StyledTableCell>
                                    <StyledTableCell>Imię</StyledTableCell>
                                    <StyledTableCell>Nazwisko</StyledTableCell>
                                    <StyledTableCell>Drużyna</StyledTableCell>
                                    <StyledTableCell>Drużyna = pełna nazwa</StyledTableCell>
                                    <StyledTableCell>Nr ewidencji</StyledTableCell>
                                    <StyledTableCell>Środki</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {fileContent.data?.map((person, index) => (
                                <StyledTableRow key={person.evidenceNumber}>
                                    <StyledTableCell component="th">
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell>{person.name}</StyledTableCell>
                                    <StyledTableCell>{person.surname}</StyledTableCell>
                                    <StyledTableCell>{person.team}</StyledTableCell>
                                    <StyledTableCell component="th">
                                        {teamsMap.find((team) => team.teamId === Number(person.team))?.name}
                                    </StyledTableCell>
                                    <StyledTableCell>{person.evidenceNumber}</StyledTableCell>
                                    <StyledTableCell>{person.balance}</StyledTableCell>
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

export default ModalImportPersonAccontState;