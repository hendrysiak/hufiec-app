import React from "react";
// import ListContainer from "../../../../components/ListContainer/ListContainer";
// import ListEl from "../../ListEl/ListEl";

import AddIcon from '@material-ui/icons/Add';

import { useSelector } from "react-redux";

import Navigation from "../../../../components/Navigation/Navigation";

const Event = props => {
  const accountState = useSelector(state => state.income.accountList).find(a => a.code === props.code);

  let incomes = 0;
 
  if(accountState){
  accountState.code !== 'nonAssigned' 
    ? accountState.income.forEach((element) => (element.persons.forEach(p => {
      incomes += p.value
    })))
    : accountState.income.forEach((element) => (element.persons.forEach(p => {
     incomes += Number(p.cash)
    })))
  }
  // console.log(incomes);
  return  (  <section className="Section">
  <header>
    <nav className="Nav">
      <Navigation list={props.codesMenu} />
    </nav>
    <h2>Dodaj rozliczenie do kodu</h2>
  </header>
  <main className="Main">
    <p>Wpływy na imprezę: <b>{incomes}</b> zł</p>
    <AddIcon />
    </main>
  </section>);
};

export default Event;
