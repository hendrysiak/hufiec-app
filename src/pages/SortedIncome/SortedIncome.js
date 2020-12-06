import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios-income";

import * as actions from "../../store/actions/index";
import store from "../../store/store";

import { sortingIncome } from '../../helpers/sorting.helper';
import { TextField, MenuItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import ListEl from "../../components/ListEl/ListEl";
import ListContainer from "../../components/ListContainer/ListContainer";

const SortedIncome = (props) => {
  
    const dbCodes = useSelector(state => state.income.codes);

    const init  = useSelector(state => state.income.initIncome);

    
    const incomesToSend  = useSelector(state => state.income.sortedIncomes);
    const outcomesToSend  = useSelector(state => state.income.sortedOutcomes);
    const registry = useSelector(state => state.income.registry);
    const currentDbIncomes = useSelector(state => state.income.dbIncomes);
    const currentDbOutcomes = useSelector(state => state.income.dbOutcomes);
    const importDates = useSelector(state => state.income.importDates);
    
    const [ currentTeam, setCurrentTeam ] = useState(6673);
    const [ displayedIncome, setDisplayedIncome ] = useState([]);
    const [codes, setCodes] = useState([]);

    const history = useHistory();

    useEffect(() => {
      const codesToSed = dbCodes.map(code => code.code)
      setCodes(codesToSed);
    },[dbCodes])

    useEffect(() => {
      if (incomesToSend && Object.values(incomesToSend).length > 0) {
        let sortedIncome;
        if (currentTeam === 'Błędne dopasowanie do jednostki') 
          sortedIncome = Object.values(incomesToSend).filter(income => !income.team);
        else sortedIncome = Object.values(incomesToSend).filter(income => income.team === currentTeam);
        setDisplayedIncome(sortedIncome);
      };
    },[currentTeam])

  
  const assignIncome = () => {

    const updatedCodes = Object.values(codes).flat();

    const { sortedIncomes, sortedOutcomes } = sortingIncome(init, registry, updatedCodes)

    store.dispatch(actions.assignIncomesToAccount(sortedIncomes));
    store.dispatch(actions.assignOutcomesToAccount(sortedOutcomes));
  };

  useEffect(() => {
    if (codes && init && registry) assignIncome();
  }, [codes, init, registry]) 


  const sendingHandler = async () => {
    const updatedIncomes = currentDbIncomes ? [...currentDbIncomes] : [];
    Object.values(incomesToSend).forEach(i => {
      const foundElement = updatedIncomes.findIndex(ui => {
        return ui.team === i.team && ui.name === i.name && ui.surname === i.surname && ui.event === i.event && ui.year === i.year
      })

      if (foundElement >= 0) updatedIncomes[foundElement].cash += i.cash;
      else updatedIncomes.push(i);
    });

    const updatedOutcomes = currentDbOutcomes ? [...currentDbOutcomes, ...Object.values(outcomesToSend)] : [...Object.values(outcomesToSend)];

    const date = new Date();
    const updatedDate = date.toLocaleString().split(',')[0];
    const updatedImportDates = [...importDates].push(updatedDate);
    
    await axios.put('/importDates.json', updatedImportDates);
    await axios.put('/incomes.json', updatedIncomes);
    await axios.put('/outcomes.json', updatedOutcomes);
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
          {[...Object.keys(registry), 'Błędne dopasowanie do jednostki'].map((item) => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
        </TextField>
   <h2>Przelewy posortowane według kodów:</h2>
          <main>
          {codes.map((item, index) => {
            const event = item;
            const children = displayedIncome.map((income, index) => {
            if (income.event === event) {
              return <ListEl key={index} title={income.title} cash={income.cash} />
            } else if (event === 'unAssigned' && (
              !income.hasOwnProperty('event') ||
              !income.hasOwnProperty('year') ||
              !income.hasOwnProperty('team') ||
              !income.hasOwnProperty('name') ||
              !income.hasOwnProperty('surname')
            )) {
              return <ListEl key={index} title={income.title} cash={income.cash} />
            }
            })
          return (<ListContainer
              key={index}
              title={item}
            >
              {children}
            </ListContainer>)
})}
          </main>
      </section>
    );
  
}





export default SortedIncome;
