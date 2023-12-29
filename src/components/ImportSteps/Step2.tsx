import { Box, Button, TextField } from "@mui/material";
import React, { MouseEvent, useState } from 'react';
import { useBankData } from "../../pages/Import/Import";
import { getDataFromXml } from "../../helpers/getDataFromXml";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";

const Step2 = () => {
    const [xmlFile, setXmlFile] = useState<File | string>('');
    const { bankData, setBankData } = useBankData();
    const { setSnackbar } = useSnackbar();

    const handleSetXmlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) setXmlFile(file);
    };

    const setUrl = (
        event: MouseEvent<HTMLButtonElement>,
    ): void => {
        event.preventDefault();
        getDataFromXml(xmlFile as File, setBankData);
    };

    React.useEffect(() => {
        if (bankData && bankData.length > 0) {
            setSnackbar({ children: 'Plik zaimportowany pomyślnie', severity: 'success' })
        }
    }, [bankData])

    return (<Box textAlign="center">
        <form>
            <Box>
                <h2>Zaimportuj XML</h2>
                <TextField
                    style={{ width: '90%', margin: '16px 0' }}
                    // value={xmlFile.}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSetXmlFile(e)}
                    select={false}
                    size="small"
                    variant="outlined"
                    margin="normal"
                    type="file"
                />
            </Box>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={typeof xmlFile === 'string'}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => setUrl(e)}
                >
                    Importuj
                </Button>
            </Box>
            <Box>
                <p>Jeśli w lewym dolnym rogu pojawi się powiadomienie, że import przebiegł pomyślnie - możesz przejść dalej</p>
            </Box>
        </form>
    </Box>)
};

export default Step2;