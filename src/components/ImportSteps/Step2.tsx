import { Box, Button, TextField } from "@mui/material";
import React, { MouseEvent, useState } from 'react';
import { useBankData } from "../../pages/Import/Import";
import { getDataFromXml } from "../../helpers/getDataFromXml";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import { useQuery } from "react-query";
import { getContentFromCSV } from "helpers/utils/getContentFromCSV";
import { IncomesBankModel } from "models/income.models";
import { getCorrectDateDDMMYYYY } from "helpers/utils/getCorrectDate";

const getProperJSONfromCSVContent = (content: any[]) => {

    const importedIncomes: IncomesBankModel[] = [];

    content.forEach((row) => {

        const parsedRow: IncomesBankModel = {
            title: row["Opis transakcji"],
            cash: Number(row["Kwota"].replace(',', '.')),
            dateOfBook: new Date(getCorrectDateDDMMYYYY(row["Data księgowania"])),
            bank: 'MBANK',
        };

        importedIncomes.push(parsedRow);

    })

    return importedIncomes;
};

const Step2 = () => {
    const [importFile, setImportFile] = useState<File | null>(null);
    const { bankData, setBankData } = useBankData();
    const { setSnackbar } = useSnackbar();

    useQuery('importFile', async () => {
        if (!importFile) return;
        const type = importFile.type;

        if (type === 'text/csv') {
            const csvContent = await getContentFromCSV(importFile);
            const content = getProperJSONfromCSVContent(csvContent);
            setBankData(content)
        } else {
            getDataFromXml(importFile as File, setBankData);
        }

    }, {
        enabled: importFile !== null,
    });

    const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) setImportFile(file);
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImportFile(e)}
                    select={false}
                    size="small"
                    variant="outlined"
                    margin="normal"
                    type="file"
                />
            </Box>
            <Box>
                <p>Jeśli w lewym dolnym rogu pojawi się powiadomienie, że import przebiegł pomyślnie - możesz przejść dalej</p>
                <p><b>UWAGA!</b> Nie ma konieczności klikania przycisku import - proces wykona się automatycznie</p>

            </Box>
        </form>
    </Box>)
};

export default Step2;