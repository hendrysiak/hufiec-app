import { TextField, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { IncomesWithImportDate } from 'models/income.models';
import { RootState } from 'store/models/rootstate.model';

import axios from '../../axios-income';

import ListContainer from '../../components/ListContainer/ListContainer';
import ListEl from '../../components/ListEl/ListEl';
import { sortingIncome } from '../../helpers/sorting.helper';
import * as actions from '../../store/actions/index';
import store from '../../store/store';


const SortedIncome = (): JSX.Element => {
  
  const dbCodes = useSelector((state: RootState) => state.income.codes);

  const init = useSelector((state: RootState) => state.income.initIncome);

    
  const incomesToSend = useSelector((state: RootState) => state.income.sortedIncomes);
  const outcomesToSend = useSelector((state: RootState) => state.income.sortedOutcomes);
  const registry = useSelector((state: RootState) => state.income.registry);
  const currentDbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const currentDbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);
  const importDates = useSelector((state: RootState) => state.income.importDates);
    
  const [ currentTeam, setCurrentTeam ] = useState('6673');
  const [ displayedIncome, setDisplayedIncome ] = useState<IncomesWithImportDate[]>([]);
  const [codes, setCodes] = useState<string[]>([]);

  const history = useHistory();

  useEffect(() => {
    if (dbCodes) {
      const codesToSend = dbCodes.map(code => code.code);
      setCodes(codesToSend);
    }
  },[dbCodes]);

  useEffect(() => {
    if (incomesToSend && Object.values(incomesToSend).length > 0) {
      let sortedIncome;
      if (!currentTeam) 
        sortedIncome = Object.values(incomesToSend).filter(income => !income.team);
      else sortedIncome = Object.values(incomesToSend).filter(income => income.team === currentTeam);
      setDisplayedIncome(sortedIncome);
    };
  },[currentTeam]);

  
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
    const updatedIncomes = currentDbIncomes ? [...currentDbIncomes] : [];
    if (incomesToSend) {
      Object.values(incomesToSend).forEach(i => {
        const foundElement = updatedIncomes.findIndex(ui => {
          return ui.team === i.team 
          && ui.name === i.name 
          && ui.surname === i.surname 
          && ui.event === i.event 
          && ui.year === i.year;
        });
  
        if (foundElement >= 0) updatedIncomes[foundElement].cash += i.cash;
        else updatedIncomes.push(i);
      });

      await axios.put('/incomes.json', updatedIncomes);
    }

    if (outcomesToSend) {
      const updatedOutcomes = currentDbOutcomes 
        ? [...currentDbOutcomes, ...Object.values(outcomesToSend)] 
        : [...Object.values(outcomesToSend)];

      await axios.put('/outcomes.json', updatedOutcomes);
    };

    const date = new Date();
    const updatedDate = date.toLocaleString().split(',')[0];
    if (importDates) {
      const updatedImportDates = [...importDates].push(updatedDate);
      await axios.put('/importDates.json', updatedImportDates);
    };
    
    history.push('/');
  };

  return (
    <section className="Section">
      <Button variant="contained" color="primary" onClick={() => sendingHandler()}>Wyślij dane na serwer</Button>
      {/* <button onClick={sendingHandler}>Wyślij dane na serwer</button> */}
      <TextField 
        value={currentTeam}
        onChange={(e) => setCurrentTeam(e.target.value)}
        placeholder="Wybierz jednostkę z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
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
            } else if (event === 'unAssigned' && (
              !income.hasOwnProperty('event') ||
              !income.hasOwnProperty('year') ||
              !income.hasOwnProperty('team') ||
              !income.hasOwnProperty('name') ||
              !income.hasOwnProperty('surname')
            )) {
              return <ListEl error={false} key={index} title={income.title} cash={income.cash} />;
            }
          });
          return (<ListContainer
            key={index}
            title={item}
          >
            {children}
          </ListContainer>);
        })}
      </main>
    </section>
  );
  
};


export default SortedIncome;
