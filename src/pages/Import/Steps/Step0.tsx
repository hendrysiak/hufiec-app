import { Box, Button } from "@mui/material";
import { createBackup } from "helpers/editing-db.handler";
import React from "react";

const Step0 = () => {
    const [dbEntries, setDbEntries] = React.useState('');

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

    return <Box textAlign="center">
        <h2>Po pierwsze - bezpieczeństwo</h2>
        <p>Proces importu to ryzykowna operacja - aplikacja będzie tworzyć wiele wpisów w bazie danych równocześnie</p>
        <p>Dlatego zachęcamy do wykonania kopii zapasowej</p>
        <p>Wciśnij przycisk <b>GENERUJ KOPIĘ ZAPASOWĄ</b>, a następnie przycisk <b>POBIERZ</b></p>
        <p>Pobrany plik zapisz na komputerze</p>
        <p>Jesli w procesie importu coś pójdzie nie tak, skontaktuj się z administratorem i przekaż mu pobrany plik - odtworzy on bazę danych z danymi sprzed importu</p>
        <Box display="flex" justifyContent="center">
            <Box marginRight={2}><Button variant="contained" color="primary" onClick={() => saveDbEntries()}>Generuj kopię zapasową</Button></Box>
            <Box marginLeft={2}><Button variant="contained" color="secondary" disabled={dbEntries.length === 0} onClick={() => downloadData()}>Pobierz</Button></Box>
        </Box>
    </Box>
};

export default Step0;