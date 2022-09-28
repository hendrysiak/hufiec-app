import { TextField, MenuItem } from '@mui/material';

import { GridCellEditCommitParams } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import {
  addIncome,
  addOutcome,
  deleteIncome,
  deleteOutcome,
  editIncome,
  editOutcome,
} from 'helpers/editing-db.handler';
import {
  BudgetEntry,
  FinanceMethod,
  FoundingSources,
  OutcomeCategory,
} from 'models/global.enum';
import {
  IncomeDb,
  IncomesWithImportDate,
  OutcomeDb,
  OutcomesWithEvent,
  OutcomeWithBilingNr,
} from 'models/income.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import * as actions from 'store/actions/index';
import { RootState } from 'store/models/rootstate.model';
import store from 'store/store';

import BudgetDataGrid from './BudgetDataGrid';

const Edit = (): JSX.Element => {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

  const [editedData, setEditedData] = useState(BudgetEntry.Income);

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && !isAuth && store.dispatch(actions.reduxIsAuthentication(true));
  }, []);

  const { setSnackbar } = useSnackbar();

  const editedDataHandler = (value: string) => {
    const editedData =
      value === 'Przychody' ? BudgetEntry.Income : BudgetEntry.Outcome;
    setEditedData(editedData);
  };

  const convertValue = (value: number | string, field: string) => {
    if (field === 'cash') return Number(value) ;
    if (field === 'errors') return (value as string).split(',');
    return value;
  };

  const editIncomeHandler = async(params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    const foundedIncome: IncomeDb | undefined = dbIncomes.find(i => i.id === id);

    if (foundedIncome && typeof value !== 'object') {
      const convertedValue = convertValue(value, field);
      try {
        await editIncome({ ...foundedIncome, [field]: convertedValue });
        setSnackbar({ children: 'Przychód wyedytowany pomyślnie', severity: 'success' });
      } catch {
        setSnackbar({ children: 'Wystąpił wewnętrzny błąd - spróbuj ponownie', severity: 'error' });

      }
    } else {
      setSnackbar({ children: 'Brak przychodu do edycji - odśwież', severity: 'error' });
    }
  };
  const editOutcomeHandler = async(params: GridCellEditCommitParams) => {
    const { id, field, value } = params;
    const foundedOutcome: OutcomeDb | undefined = dbOutcomes.find(i => i.id === id);

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
      return await editIncomeHandler(params);
    }

    return await editOutcomeHandler(params);
  };

  const handleDelete = (id: string) => {
    editedData === BudgetEntry.Income ? deleteIncome(id) : deleteOutcome(id);
  };

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

  const handleDeleteBudgetEntry = (entryId: string) => async (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();

    if (!window.confirm('Jesteś pewny/-a, że chcesz usunąć pozycję?')) return;

    if (editedData === BudgetEntry.Income) {
      return await deleteIncomeHandler(entryId);
    }

    return await deleteOutcomeHandler(entryId);
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

  return (
    <>
      <div>
        <header>
          <TextField
            style={{ width: '79%', marginTop: '16px' }}
            label="Co edytujesz?"
            value={editedData === 'income' ? 'Przychody' : 'Koszty'}
            onChange={(e) => editedDataHandler(e.target.value)}
            placeholder="Wybierz kod z listy"
            select={true}
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
        </header>

        <main>
          <section style={{ height: '92vh' }}>
            <BudgetDataGrid 
              editedData={editedData}
              displayedIncome={dbIncomes}
              displayedOutcome={dbOutcomes}
              handleCellEditCommit={handleCellEditCommit}
              addNewPosition={addNewPosition}
              handleDeleteBudgetEntry={handleDeleteBudgetEntry}
            />
          </section>
        </main>
      </div>
    </>
  );
};

export default Edit;
