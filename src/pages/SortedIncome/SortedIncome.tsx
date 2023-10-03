import { TextField, MenuItem, CircularProgress, CircularProgressProps, Box, Typography  } from '@mui/material';
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
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';
import { sleep } from 'helpers/utils/sleep';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function SortedIncome(): JSX.Element {
  const dbCodes = useSelector((state: RootState) => state.income.codes);

  const init = useSelector((state: RootState) => state.income.initIncome);

  const incomesToSend = useSelector((state: RootState) => state.income.sortedIncomes);
  const outcomesToSend = useSelector((state: RootState) => state.income.sortedOutcomes);
  const registry = useSelector((state: RootState) => state.income.registry);

  const [currentTeam, setCurrentTeam] = useState('6673');
  const [displayedIncome, setDisplayedIncome] = useState<IncomesWithImportDate[]>([]);
  const [codes, setCodes] = useState<string[]>([]);
  const [progress, setProgress] = React.useState(0);

  const history = useHistory();

  const { setSnackbar } = useSnackbar();

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

  const sendingHandler = async () => {
    setProgress(0)
    const updatedIncomes: IncomesWithImportDate[] = [];
    if (incomesToSend) {
      console.log('inside', incomesToSend)
      setSnackbar({ children: 'Wysyłanie przychodów', severity: 'info' });

      Object.values(incomesToSend).forEach((i) => {
        updatedIncomes.push(i);
      });

      setProgress(1)

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
        setProgress(0)
      }

      await sleep(2000)
    }

    if (outcomesToSend) {
      setSnackbar({ children: 'Wysyłanie kosztów', severity: 'info' });
      const updatedOutcomes = [...Object.values(outcomesToSend)];

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
        setProgress(0)
      }

    }

    await sleep(2000)

    history.push('/');
  };

  return (
    progress > 0 ? <div className="loader"><CircularProgressWithLabel value={progress}/></div>
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
