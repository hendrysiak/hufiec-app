import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../../axios-income";

import * as actions from "../../../../store/actions/index";
import store from "../../../../store/store";

import { sortingIncome } from '../../../../helpers/sorting.helper';
import { TextField, MenuItem } from '@material-ui/core';

import ListEl from "../../../../components/ListEl/ListEl";
import ListContainer from "../../../../components/ListContainer/ListContainer";

const SortedIncome = (props) => {
  
    const [income, setIncome] = useState(null);
    const codes = useSelector(state => state.income.codes);

    const init  = useSelector(state => state.income.initIncome);

    const [ currentTeam, setCurrentTeam ] = useState(null);
    const [ displayedIncome, setDisplayedIncome ] = useState([]);

    const incomesToSend  = useSelector(state => state.income.sortedIncomes);
    const outcomesToSend  = useSelector(state => state.income.sortedOutcomes);
    const registry = useSelector(state => state.income.registry);
    const currentDbIncomes = useSelector(state => state.income.dbIncomes);
    const currentDbOutcomes = useSelector(state => state.income.dbOutcomes);

    const history = useHistory();


    useEffect(() => {
      if (incomesToSend && Object.values(incomesToSend).length > 0) {
        const sortedIncome = Object.values(incomesToSend).filter(income => income.team === currentTeam);
        console.log(sortedIncome);
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
    const updatedIncomes = [...currentDbIncomes, ...Object.values(incomesToSend)];
    const updatedOutcomes = [...currentDbOutcomes, ...Object.values(outcomesToSend)];
    await axios.put('/incomes.json', updatedIncomes);
    await axios.put('/outcomes.json', updatedOutcomes);
    history.push('/');
  };


    return (
      <section className="Section">
        <button onClick={sendingHandler}>Wyślij dane na serwer</button>
        <TextField 
          value={currentTeam}
          onChange={(e) => setCurrentTeam(e.target.value)}
          placeholder="Wybierz jednostkę z listy"
          select={true}
          size="small"
          variant="outlined"
          Smargin="normal"
          SelectProps={{
            MenuProps: { disableScrollLock: true }
          }}
        >
          {[null, ...Object.keys(registry)].map((item) => (
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
            } else if (event === 'nonAssigned' && (
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
