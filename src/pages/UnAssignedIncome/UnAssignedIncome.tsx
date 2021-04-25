import Button from '@material-ui/core/Button';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';

import { IncomesBankModel } from 'models/income.models';

import ListContainer from 'shared/ListContainer/ListContainer';
import ListEl from 'shared/ListEl/ListEl';

import { LogOut } from 'shared/LogOut/LogOut';
import Navigation from 'shared/Navigation/Navigation';
import * as actions from 'store/actions/index';
import { RootState } from 'store/models/rootstate.model';

import store from 'store/store';

const UnAssignedIncome = (): JSX.Element => {

  const initIncome = useSelector((state: RootState) => state.income.initIncome);
  const registry = useSelector((state: RootState) => state.income.registry);

  const [currentIncome, setCurrentIncome] = useState<IncomesBankModel[]>();

  const history = useHistory();

  useEffect(() => {
    initIncome && setCurrentIncome(initIncome);
  }, [initIncome]);

  const verifyTeams = () => {
    history.push('/transfers/sorted');
  };


  const editIncome = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    if (initIncome) {
      const incomeToEdit = [...initIncome];
      incomeToEdit[index].title = event.target.value;
      setCurrentIncome(incomeToEdit);
    }
  };

  const updateIncome = () => {
    currentIncome && store.dispatch(actions.reduxEditIncome(currentIncome));
  };


  let listOfIncome;
  if (currentIncome && registry) {
    listOfIncome = currentIncome.map((element, index) => {
      const patterns = [...Object.keys(registry)].map(
        el => new RegExp(`${el}`, 'm')
      );
      patterns.splice(patterns.length - 1, 1);
      if (patterns.some(item => item.test(element.title))) {
        return (
          <ListEl
            key={index}
            error={false}
            title={element.title}
            cash={element.cash}
            clicked={event => editIncome(event, index)}
          />
        );
      } else {
        return (
          <ListEl
            error={true}
            key={index}
            title={element.title}
            cash={element.cash}
            clicked={event => editIncome(event, index)}
          />
        );
      }
    });
  }

  return (
    <>
      <LogOut />
      <Navigation />
      <section className="Section">
        <div style={{ marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={() => updateIncome()}>Zaktualizuj przelewy</Button>
          <Button variant="contained" color="secondary" onClick={() => verifyTeams()}>Posortuj przelewy</Button>
          {/* <button onClick={() => updateIncome()}>Zaktualizuj przelewy</button>
          <button onClick={() => verifyTeams()}>Posortuj przelewy</button> */}
          <h2>Przelewy zaimportowane:</h2>
        </div>
        {listOfIncome && <ListContainer>{listOfIncome}</ListContainer>}
      </section>
    </>
  );
};


export default UnAssignedIncome;
