import React from "react";
import ListContainer from "../../ListContainer/ListContainer";
import ListEl from "../../ListEl/ListEl";

const Code = props => {
  let incomes;
  if (props.income) {
    incomes = props.income.income.map((element, index) => (
      <ListContainer key={index} title={element.team}>
        {props.income.code !== "nonAssigned"
          ? element.persons.map(person => (
              <ListEl
                cash={person.value}
                title={`${person.name} ${person.surname}`}
              />
            ))
          : element.persons.map(person => (
              <ListEl cash={person.cash} title={person.title} />
            ))}
      </ListContainer>
    ));
  }
  return <div>{incomes}</div>;
};

export default Code;
