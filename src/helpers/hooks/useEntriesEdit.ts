import { GridCellEditCommitParams } from "@mui/x-data-grid";
import { editIncome, editOutcome, deleteIncome, deleteOutcome, addIncome, addOutcome } from "helpers/editing-db.handler";
import { BudgetEntry, FoundingSources, OutcomeCategory, FinanceMethod } from "models/global.enum";
import { IncomeDb, OutcomeDb, IncomesWithImportDate, OutcomeWithBilingNr } from "models/income.models";
import { useSnackbar } from "providers/SnackbarProvider/SnackbarProvider";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";

export const useEntriesEdit = () => {
    const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
    const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

    const [editedData, setEditedData] = React.useState(BudgetEntry.Income);
    const { setSnackbar } = useSnackbar();

    const editedDataHandler = (value: string) => {
      const newEditedData = value === 'Przychody' ? BudgetEntry.Income : BudgetEntry.Outcome;
      setEditedData(newEditedData);
    };
  
    const convertValue = (value: number | string, field: string) => {
      if (field === 'cash') return Number(value);
      if (field === 'errors') return (value as string).split(',');
      if (field === 'isEdited') return Boolean(value);
      return value;
    };
  
    const editIncomeHandler = async (params: GridCellEditCommitParams) => {
      const { id, field, value } = params;
      const foundedIncome: IncomeDb | undefined = dbIncomes.find((i) => i.id === id);
  
      if (foundedIncome && typeof value !== 'object') {
        const convertedValue = convertValue(value, field);
        const isEdited = field === 'isEdited' ? convertedValue as boolean : field === 'incomeCategory' ? true : foundedIncome.isEdited;
        try {
          await editIncome({ ...foundedIncome, [field]: convertedValue, isEdited });
          setSnackbar({ children: 'Przychód wyedytowany pomyślnie', severity: 'success' });
        } catch {
          setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
        }
      } else if (foundedIncome && field.toLowerCase().match('date')) {
        try {
          await editIncome({ ...foundedIncome, [field]: new Date(value).toISOString() });
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
      const foundedOutcome: OutcomeDb | undefined = dbOutcomes.find((i) => i.id === id);
  
      if (foundedOutcome && typeof value !== 'object') {
        const convertedValue = convertValue(value, field);
        try {
          await editOutcome({ ...foundedOutcome, [field]: convertedValue });
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
  
    // const handleDelete = (id: string) => {
    //   editedData === BudgetEntry.Income ? deleteIncome(id) : deleteOutcome(id);
    // };
  
    const deleteIncomeHandler = async (incomeId: string) => {
      try {
        await deleteIncome(incomeId);
        setSnackbar({ children: 'Przychód usunięty pomyślnie', severity: 'success' });
      } catch {
        setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
      }
    };
  
    const deleteOutcomeHandler = async (outocmeId: string) => {
      try {
        await deleteOutcome(outocmeId);
        setSnackbar({ children: 'Koszt usunięty pomyślnie', severity: 'success' });
      } catch {
        setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });
      }
    };
  
    const handleDeleteBudgetEntry = (
      entryId: string,
    ) => async (
      event: { stopPropagation: () => void; },
    ) => {
      event.stopPropagation();
  
      if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć pozycję?')) return;
  
      if (editedData === BudgetEntry.Income) {
        return deleteIncomeHandler(entryId);
      }
  
      return deleteOutcomeHandler(entryId);
    };
  
    const addNewPosition = (): void => {
      const currentDate = new Date();
  
      if (editedData === BudgetEntry.Income) {
        const newIncome: IncomesWithImportDate = {
          cash: 0,
          event: null,
          importDate: currentDate,
          name: null,
          surname: null,
          team: '',
          title: '',
          year: currentDate.getFullYear(),
          dateOfBook: currentDate,
        };
  
        addIncome(newIncome);
      } else {
        const newOutcome: OutcomeWithBilingNr = {
          cash: 0,
          event: null,
          importDate: currentDate,
          bilingNr: null,
          foundingSource: FoundingSources.Other,
          outcomeCategory: OutcomeCategory.Fee,
          team: '',
          title: '',
          year: currentDate.getFullYear(),
          financeMethod: FinanceMethod.Cash,
          dateOfBook: currentDate,
        };
  
        addOutcome(newOutcome);
      }
    };

    return { addNewPosition, editedData, editedDataHandler, handleCellEditCommit, handleDeleteBudgetEntry };
}