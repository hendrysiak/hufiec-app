import React from "react";
import ListContainer from "../../ListContainer/ListContainer";
import ListEl from "../../ListEl/ListEl";

const Event = props => {
  let incomes;
  if (props.income) {
    props.income.code !== 'nonAssigned'
    
    ? incomes = props.income.income.map((element, index) => (
      <ListContainer key={index} title={element.team}>
        {element.persons.map(person => (
          <ListEl
            cash={person.value}
            title={`${person.name} ${person.surname}`}
          />
        ))}
      </ListContainer>
    ))

    : incomes = props.income.income.map((element, index) => (
      <ListContainer key={index} title={element.team}>
        {element.persons.map(person => (
          <ListEl
            cash={person.cash}
            title={`${person.title}`}
          />
        ))}
      </ListContainer>
    ))
  }
  return <div>{incomes}</div>;
};

export default Event;
