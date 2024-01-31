import { Box, Button, MenuItem, TextField } from "@mui/material";
import { sortingIncome } from "helpers/sorting.helper";
import { BudgetEntry, FoundingSources, OutcomeCategory } from "models/global.enum";
import BudgetDataGrid from "components/BudgetDataGrid/BudgetDataGrid";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";
import { useBankData } from "../../legacy/Import/Import";
import { IncomeDb, IncomesWithImportDate, OutcomeDb, OutcomesWithFinanceMethod } from "models/income.models";
import { GridCellEditCommitParams } from "@mui/x-data-grid";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import { sleep } from "helpers/utils/sleep";
import axios from 'axios-income';
import CircularProgressWithLabel from "../Loader/Loader";

const Step3 = () => {
    const dbCodes = useSelector((state: RootState) => state.income.codes);
    const registry = useSelector((state: RootState) => state.income.registry);

    const [editedData, setEditedData] = React.useState(BudgetEntry.Income);
    const [codes, setCodes] = React.useState<string[]>([]);
    const { bankData, handleFinish } = useBankData()

    const [incomes, setIncomes] = React.useState<IncomeDb[]>([])
    const [outcomes, setOutcomes] = React.useState<OutcomeDb[]>([])

    const [progress, setProgress] = React.useState(0);

    const { setSnackbar } = useSnackbar();

    const editedDataHandler = (value: string) => {
        const newEditedData = value === 'Przychody' ? BudgetEntry.Income : BudgetEntry.Outcome;
        setEditedData(newEditedData);
    };

    const convertValue = (value: number | string, field: string) => {
        if (field === 'cash') return Number(value);
        if (field === 'errors') return (value as string).split(',');
        return value;
    };

    const editIncomeHandler = async (params: GridCellEditCommitParams) => {
        const { id, field, value } = params;
        const foundedIncomeIndex = incomes.findIndex((i) => i.id === id);
        const foundedIncome: IncomeDb | undefined = incomes[foundedIncomeIndex];

        if (foundedIncome && typeof value !== 'object') {
            const convertedValue = convertValue(value, field);
            try {
                setIncomes(incomes.map((income, index) => {
                    if (index === foundedIncomeIndex) {
                        return { ...income, [field]: convertedValue }
                    }
                    return { ...income }
                }))
                setSnackbar({ children: 'Przychód wyedytowany pomyślnie', severity: 'success' });
            } catch {
                setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
            }
        } else {
            setSnackbar({ children: 'Brak przychodu do edycji - odśwież', severity: 'error' });
        }
    };
    const editOutcomeHandler = async (params: GridCellEditCommitParams) => {
        const { id, field, value } = params;
        const foundedOutcomeIndex = outcomes.findIndex((i) => i.id === id);
        const foundedOutcome: OutcomeDb | undefined = outcomes[foundedOutcomeIndex];

        if (foundedOutcome && typeof value !== 'object') {
            const convertedValue = convertValue(value, field);
            try {
                setOutcomes(outcomes.map((outcome, index) => {
                    if (index === foundedOutcomeIndex) {
                        return { ...outcome, [field]: convertedValue }
                    }
                    return { ...outcome }
                }))
                setSnackbar({ children: 'Koszt wyedytowany pomyślnie', severity: 'success' });
            } catch {
                setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
            }
        } else {
            setSnackbar({ children: 'Brak kosztu do edycji - odśwież', severity: 'error' });
        }
    };

    const handleCellEditCommit = async (params: GridCellEditCommitParams) => {
        if (editedData === BudgetEntry.Income) {
            return editIncomeHandler(params);
        }

        return editOutcomeHandler(params);
    };

    const handleDeleteBudgetEntry = (
        entryId: string,
      ) => async (
        event: { stopPropagation: () => void; },
      ) => {
        event.stopPropagation();
    
        if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć pozycję?')) return;
    
        if (editedData === BudgetEntry.Income) {
            setIncomes(incomes.filter(income => income.id !== entryId))
        }
        setOutcomes(outcomes.filter(outcome => outcome.id !== entryId))
      };

      const sendingHandler = async () => {
        setProgress(0);
        const updatedIncomes: IncomesWithImportDate[] = [];
        if (incomes) {
          setSnackbar({ children: 'Wysyłanie przychodów', severity: 'info' });
    
          Object.values(incomes).forEach((i) => {
            const { id, ...rest} = i
            updatedIncomes.push({ ...rest });
          });
    
          setProgress(1);
    
          const updatedIncomesPromises = updatedIncomes.map(async (uI, index, arr) => axios.post('/incomes.json', uI, {
            onUploadProgress() {
              setProgress((index / arr.length) * 100)
            },
          }));
    
          try {
            await Promise.all(updatedIncomesPromises);
            setSnackbar({ children: 'Wysyłanie przychodów zakończone', severity: 'success' });
          } catch {
            setSnackbar({ children: 'Wysyłanie przychodów zakończone błędem', severity: 'error' });
          } finally {
            setProgress(0);
          }
    
          await sleep(2000);
        }
    
        if (outcomes) {
        const updatedOutcomes: OutcomesWithFinanceMethod[] = [];
          setSnackbar({ children: 'Wysyłanie kosztów', severity: 'info' });
          Object.values(outcomes).forEach((o) => {
            const { id, ...rest} = o
            updatedOutcomes.push({ ...rest })
          });
    
          setProgress(1)
    
          const updatedOutcomesPromises = updatedOutcomes.map(async (uO, index, arr) => axios.post('/outcomes.json', uO, {
            onUploadProgress() {
              setProgress((index / arr.length) * 100)
            },
          }));
    
          try {
            await Promise.all(updatedOutcomesPromises);
            setSnackbar({ children: 'Wysyłanie kosztów zakończone', severity: 'success' });
          } catch {
            setSnackbar({ children: 'Wysyłanie kosztów zakończone błędem', severity: 'error' });
          } finally {
            setProgress(0);
          }
    
        }
    
        await sleep(2000);
        setSnackbar({ children: 'Import przebiegł pomyślnie', severity: 'success' });
        handleFinish();
      };

    React.useEffect(() => {
        if (dbCodes) {
            const codesToSend = dbCodes.map((code) => code.code);
            setCodes(codesToSend);
        }
    }, [dbCodes]);

    React.useEffect(() => {
        if (codes && bankData && registry) {
            const { sortedIncomes, sortedOutcomes } = sortingIncome(bankData, registry, codes);
            setIncomes(sortedIncomes.map((income, index) => ({ ...income, id: `income-${index}` })))
            setOutcomes(sortedOutcomes.map((outcome, index) => ({ ...outcome, id: `outcome-${index}`, bilingNr: '', foundingSource: FoundingSources.SelfPayment, team: '', outcomeCategory: OutcomeCategory.Fee })))
        }
    }, [codes, bankData, registry])


    return (progress > 0 ? <div className="loader" style={{ height: '82vh', position: 'unset' }}><CircularProgressWithLabel value={progress}/></div> : <><Box textAlign="center">
        <h2>Edytowanie zaimportowanych przelewów</h2>
        <p>W tym miejscu możesz sprawdzić wynik operacji importowania oraz usunąć zbędne pozycje ręcznie</p>
        <p>Możesz też ręcznie poprawić błędne pozycje - poprawki zostaną uwzględnione w imporcie</p>
        <p>Jeśli wszystkie dane są poprawne - kliknij przycisk <b>WYŚLIJ DANE NA SERWER</b></p>
        <TextField
            style={{ width: '40%', marginTop: '16px' }}
            label="Co edytujesz?"
            value={editedData === 'income' ? 'Przychody' : 'Koszty'}
            onChange={(e) => editedDataHandler(e.target.value)}
            placeholder="Wybierz kod z listy"
            select
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
                MenuProps: { disableScrollLock: true },
            }}
        >
            {['Przychody', 'Koszty'].map((item) => (
                <MenuItem key={item} value={item}>
                    {item}
                </MenuItem>
            ))}
        </TextField>
    </Box>
        <Box>
            <section style={{ height: '42vh' }}>
                <BudgetDataGrid
                    editedData={editedData}
                    displayedIncome={incomes}
                    displayedOutcome={outcomes}
                    handleCellEditCommit={handleCellEditCommit}
                    handleDeleteBudgetEntry={handleDeleteBudgetEntry}
                />
            </section>
            <Box m={2} textAlign="center">
                <Button variant="contained" color="primary"  onClick={() => sendingHandler()}>Wyślij dane na server</Button></Box>
        </Box>
        </>)
};

export default Step3;