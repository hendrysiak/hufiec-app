import React from "react";
import ListContainer from "../../ListContainer/ListContainer";
import ListEl from "../../ListEl/ListEl";

import Navigation from "../../Navigation/Navigation";

import { useSelector } from "react-redux";

const Code = props => {
  const accountState = useSelector(state => state.income.accountList).find(a => a.code === props.code);

  let incomes;
  if (accountState) {
    accountState.code !== 'unAssigned'
    
    ? incomes = accountState.income.map((element, index) => (
      <ListContainer key={index} title={element.team}>
        {element.persons.map(person => (
          <ListEl
            key={person}
            cash={person.value}
            title={`${person.name} ${person.surname}`}
          />
        ))}
      </ListContainer>
    ))

    : incomes = accountState.income.map((element, index) => (
      <ListContainer key={index} title={element.team}>
        {element.persons.map(person => (
          <ListEl
            key={person}
            cash={person.cash}
            title={`${person.title}`}
          />
        ))}
      </ListContainer>
    ))
  }
  return (  <section className="Section">
  <header>
    <nav className="Nav">
      <Navigation list={props.codesMenu} />
    </nav>
    <h2>Lista wpływów po kodzie</h2>
  </header>
  <main className="Main">{incomes}</main>
  </section>);

};

export default Code;
