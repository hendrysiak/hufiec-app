import { TextField, MenuItem } from '@mui/material';

import { useEffect } from 'react';

import { useSelector } from 'react-redux';


import * as actions from 'store/actions/index';
import { RootState } from 'store/models/rootstate.model';
import store from 'store/store';

import BudgetDataGrid from './BudgetDataGrid';
import { useEntriesEdit } from 'helpers/hooks/useEntriesEdit';

function Edit(): JSX.Element {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuth) {
      store.dispatch(actions.reduxIsAuthentication(true));
    }
  }, [isAuth]);

  const { editedData, editedDataHandler, addNewPosition, handleCellEditCommit, handleDeleteBudgetEntry } = useEntriesEdit();

  return (
    <div>
      <header>
        <TextField
          style={{ width: '79%', marginTop: '16px' }}
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
      </header>

      <main>
        <section style={{ height: '92vh' }}>
          <BudgetDataGrid
            editedData={editedData}
            displayedIncome={dbIncomes.reverse()}
            displayedOutcome={dbOutcomes.reverse()}
            handleCellEditCommit={handleCellEditCommit}
            addNewPosition={addNewPosition}
            handleDeleteBudgetEntry={handleDeleteBudgetEntry}
          />
        </section>
      </main>
    </div>
  );
}

export default Edit;
