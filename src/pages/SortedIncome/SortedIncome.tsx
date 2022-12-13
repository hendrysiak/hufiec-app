import { TextField, MenuItem, CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import axios from 'axios-income';
import { IncomesWithImportDate } from 'models/income.models';

import ListContainer from 'shared/ListContainer/ListContainer';
import ListEl from 'shared/ListEl/ListEl';

import * as actions from 'store/actions/index';
import { RootState } from 'store/models/rootstate.model';
import store from 'store/store';

import { sortingIncome } from '../../helpers/sorting.helper';

function SortedIncome(): JSX.Element {
  const dbCodes = useSelector((state: RootState) => state.income.codes);

  const init = useSelector((state: RootState) => state.income.initIncome);

  const incomesToSend = useSelector((state: RootState) => state.income.sortedIncomes);
  const outcomesToSend = useSelector((state: RootState) => state.income.sortedOutcomes);
  const registry = useSelector((state: RootState) => state.income.registry);
  const importDates = useSelector((state: RootState) => state.income.importDates);

  const [currentTeam, setCurrentTeam] = useState('6673');
  const [displayedIncome, setDisplayedIncome] = useState<IncomesWithImportDate[]>([]);
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (dbCodes) {
      const codesToSend = dbCodes.map((code) => code.code);
      setCodes(codesToSend);
    }
  }, [dbCodes]);

  useEffect(() => {
    if (incomesToSend && Object.values(incomesToSend).length > 0) {
      let sortedIncome;
      if (!currentTeam) { sortedIncome = Object.values(incomesToSend).filter((income) => !income.team); } else sortedIncome = Object.values(incomesToSend).filter((income) => income.team === currentTeam);
      setDisplayedIncome(sortedIncome);
    }
  }, [currentTeam]);

  const assignIncome = () => {
    if (codes && init && registry) {
      const { sortedIncomes, sortedOutcomes } = sortingIncome(init, registry, codes);

      store.dispatch(actions.reduxAssignIncomesToAccount(sortedIncomes));
      store.dispatch(actions.reduxAssignOutcomesToAccount(sortedOutcomes));
    }
  };

  useEffect(() => {
    assignIncome();
  }, [codes, init, registry]);

  const sendingHandler = () => {
    setLoading(true);
    const updatedIncomes: IncomesWithImportDate[] = [];
    if (incomesToSend) {
      Object.values(incomesToSend).forEach((i) => {
        updatedIncomes.push(i);
      });

      updatedIncomes.forEach(async (uI) => axios.post('/incomes.json', uI));
    }

    if (outcomesToSend) {
      const updatedOutcomes = [...Object.values(outcomesToSend)];

      updatedOutcomes.forEach(async (uO) => axios.post('/outcomes.json', uO));
    }

    const date = new Date();

    const importDatesToUpdate = importDates && importDates.length > 0 ? importDates : [];
    const updatedImportDates = [...importDatesToUpdate, date];
    (async () => axios.put('/importDates.json', updatedImportDates))();

    setLoading(false);
    history.push('/');
  };

  return (
    loading ? <div className="loader"><CircularProgress /></div>
      : (
        <section className="Section">
          <Button variant="contained" color="primary" onClick={() => sendingHandler()}>Wyślij dane na serwer</Button>
          <TextField
            value={currentTeam}
            onChange={(e) => setCurrentTeam(e.target.value)}
            placeholder="Wybierz jednostkę z listy"
            select
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
              MenuProps: { disableScrollLock: true },
            }}
          >
            {registry && [...Object.keys(registry), 'Błędne dopasowanie do jednostki'].map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
          <h2>Przelewy posortowane według kodów:</h2>
          <main>
            {codes.map((item, index) => {
              const event = item;
              const children = displayedIncome.map((income, index) => {
                if (income.event === event) {
                  return <ListEl error={false} key={index} title={income.title} cash={income.cash} />;
                } if (event === 'unAssigned' && (
                  !income.hasOwnProperty('event')
              || !income.hasOwnProperty('year')
              || !income.hasOwnProperty('team')
              || !income.hasOwnProperty('name')
              || !income.hasOwnProperty('surname')
                )) {
                  return <ListEl error={false} key={index} title={income.title} cash={income.cash} />;
                }
              });
              return (
                <ListContainer
                  key={index}
                  title={item}
                >
                  {children}
                </ListContainer>
              );
            })}
          </main>
        </section>
      )
  );
}

export default SortedIncome;
