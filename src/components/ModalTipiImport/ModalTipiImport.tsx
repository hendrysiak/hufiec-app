import { Modal, Box, Grid, Typography, IconButton, Drawer, Paper } from "@mui/material";
import { useTeams } from "helpers/hooks/useTeams";
import { getPlainRegistry } from "helpers/api-helpers/account.handler";
import TipiInstruction from 'assets/filters.png';
import React from "react";
import { useQuery } from "react-query";
import { Person } from "models/registry.models";
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InputFileUpload from "components/InputFileUpload/InputFileUpload";
import { getContentFromCSV } from "helpers/utils/getContentFromCSV";
import stripBom from "strip-bom";
import { contains } from "helpers/utils/contains";
import { StyledDataGrid } from "shared/StyledDataGrid/StyledDataGrid";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import { localizationDataGrid } from "shared/localization.helper";

interface ModalImportPersonAccontStateProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

enum PersonError {
    TEAM = 'TEAM',
    NON_EXIST = 'NON_EXIST',
}

const getProperJSONfromCSVContent = (content: any[], registry: Record<string, Person>) => {
    return content.map((row) => {
        const parsedRow: any = {};

        Object.entries(row).forEach(([key, value]) => {
            parsedRow[stripBom(key)] = value;
        });

        const person: Person = {
            name: parsedRow["Imię"],
            surname: parsedRow["Nazwisko"],
            team: parsedRow["Przydział"],
            evidenceNumber: parsedRow["Numer członkowski"],
            dateOfAdd: parsedRow["Data wstąpienia do ZHP"],
            dateOfDelete: parsedRow["Data odejścia z ZHP"],
        }

        return person;
    })
};

function EditToolbar() {

    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={{
                utf8WithBom: true,
            }}
            />
        </GridToolbarContainer>
    );
}

const ModalTipiImport = (props: ModalImportPersonAccontStateProps) => {
    // add reading csv file with imported data
    const { open, setOpen } = props;

    const [openHelp, setOpenHelp] = React.useState(false);
    // const [mappedRegistry, setMappedRegistry] = React.useState<Record<string, Person> | undefined>(undefined);
    // const [dbEntries, setDbEntries] = React.useState('');
    const [file, setFile] = React.useState<File | null>(null);
    const teamsMap = useTeams();

    const { data: registry } = useQuery('plain-registry', () => getPlainRegistry());

    const fileContent = useQuery('tipiImport', async () => {
        if (!file || !registry) return;
        const csvContent = await getContentFromCSV(file);
        return getProperJSONfromCSVContent(csvContent, registry);
    }, {
        enabled: file !== null && registry !== undefined,
    });

    // const { setSnackbar } = useSnackbar();

    // const mapRegistryNumber = async () => {
    //     const updatedRegistry = registry;

    //     for (const person in updatedRegistry) {
    //         const name = updatedRegistry[person].name;
    //         const surname = updatedRegistry[person].surname;

    //     }

    //     setMappedRegistry(updatedRegistry);
    // }

    // const updateData = async () => {
    //     console.log(mappedRegistry);

    //     if (!mappedRegistry) {
    //         setSnackbar({ children: 'Brak danych do zapisania', severity: 'error' });
    //         return
    //     };

    //     try {
    //         const data = await updatePlainRegistry(mappedRegistry);

    //         if (data) {
    //             setSnackbar({ children: 'Dane zaktualizowane', severity: 'success' });
    //         }

    //     } catch {
    //         setSnackbar({ children: 'Wystąpił błąd - odśwież', severity: 'error' });
    //     }
    // };

    // const saveDbEntries = async () => {
    //     const entries = await createBackup();
    //     setDbEntries(entries);
    // }

    // const downloadData = () => {
    //     var a = document.createElement("a");
    //     var file = new Blob([dbEntries], { type: "application/json" });
    //     a.href = URL.createObjectURL(file);
    //     a.download = 'finance-zhprsl-export.json';
    //     a.click();
    // }

    const handleClose = () => {
        fileContent.remove();
        setFile(null);
        // setDbEntries('');
        // setMappedRegistry(undefined);
        setOpen(false);
    };

    const columns = [
        { field: 'name', headerName: 'Imię', width: 150, },
        { field: 'surname', headerName: 'Nazwisko', width: 150, },
        { field: 'team', headerName: 'Drużyna', width: 350, },
        { field: 'teamId', headerName: 'Id drużyny', width: 150, },
        { field: 'evidenceNumber', headerName: 'Numer ewidencji', width: 150, },
        { field: 'dateOfAdd', headerName: 'Data wstąpienia', width: 150, },
        { field: 'dateOfDelete', headerName: 'Data odejścia', width: 150, },
        { field: 'existInApplication', headerName: 'Istnieje w aplikacji?', width: 150, },
        { field: 'teamInApplication', headerName: 'Drużyna w aplikacji', width: 150, },
    ];

    const rows = React.useMemo(() => fileContent.data?.map((person, index) => {

        if (!registry) return [];

        const existInApplication = contains(registry, person.evidenceNumber);
        let id = index + person.name + person.surname;
        let teamInApplication = 'Brak';
        const teamId = teamsMap?.find((team) => team.name === `${person.team}`)?.teamId;

        if (existInApplication) {
            const personInApplication = Object.entries(registry).find(([id, personInApp]) => person.evidenceNumber === personInApp.evidenceNumber);

            id = personInApplication ? personInApplication[0] : id;
            teamInApplication = personInApplication ? `${personInApplication[1].team}` : teamInApplication;
        }

        let error = null;

        if (`${teamId}` !== `${teamInApplication}`) {
            error = PersonError.TEAM;
        };

        if (!existInApplication) {
            error = PersonError.NON_EXIST;
        };

        return {
            id,
            name: person.name,
            surname: person.surname,
            team: person.team,
            teamId: teamId,
            evidenceNumber: person.evidenceNumber,
            dateOfAdd: person.dateOfAdd,
            dateOfDelete: person.dateOfDelete,
            existInApplication: existInApplication ? 'Tak' : 'Nie',
            teamInApplication: teamInApplication,
            error,
        }
    }) ?? [], [fileContent.data, registry]);

    if (!registry) return null;

    return (
        <>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box p={4} overflow="hidden" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "100vw", height: "100vh", bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography textAlign="center" variant="h3">Import danych z Tipi</Typography>
                <IconButton
                    aria-label="help"
                    onClick={() => setOpenHelp(true)}
                    sx={{
                        position: 'absolute',
                        right: 48,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <HelpOutlineIcon />
                </IconButton>
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
                        <p>Import ma obecnie tylko rolę poglądową</p>
                        <p>Na stronie "Edytuj drużyny" należy wpisać nazwy drużyn tożsame z Tipi</p>
                    </Box>
                    <Box alignItems="center">
                        <Typography variant="h5">Wybierz plik z danymi</Typography>
                        <InputFileUpload file={file} setFile={setFile} />
                    </Box>
                </Box>
                <Box textAlign="center">
                    <Typography variant="h4">Zaimportowane dane</Typography>
                </Box>
                <Box height="70%">
                    <StyledDataGrid
                        columns={columns}
                        rows={rows}
                        getRowClassName={(params) => `super-app-theme--${params.row.error === PersonError.TEAM ? 'PartiallyFilled' : params.row.error === PersonError.NON_EXIST ? 'Rejected' : ''}`
                        }
                        components={{
                            Toolbar: EditToolbar,
                        }}
                        localeText={localizationDataGrid}
                    />
                </Box>
                <Grid container spacing={2} pt={4}>
                    {/* <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={() => saveDbEntries()}>Generuj kopię zapasową</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="secondary" disabled={dbEntries.length === 0} onClick={() => downloadData()}>Pobierz backup</Button>
                    </Grid> */}
                    {/* <Grid item xs={3}>
                        <Button variant="contained" color="secondary" onClick={mapRegistryNumber}>Mapuj dane</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="secondary" disabled={!mappedRegistry} onClick={updateData}>Zapisz dane</Button>
                    </Grid> */}
                </Grid>
            </Box>
        </Modal>
        <Drawer anchor="right" style={{ zIndex: 1400 }} open={openHelp} onClose={() => setOpenHelp(false)}>
            <Paper>
                <Box p={4}>
                    <Typography variant="h4" textAlign="center">Instrukcja</Typography>
                    <p>Należy wejśc w "Raporty" w Tipi i wybrać następujące opcje</p>
                    <img src={TipiInstruction} />
                </Box>
            </Paper>
        </Drawer>
        </>
    );
}

export default ModalTipiImport;