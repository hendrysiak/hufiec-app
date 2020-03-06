import React from "react";
import ListContainer from "../../ListContainer/ListContainer";
import ListEl from "../../ListEl/ListEl";

const Code = props => {
  let incomes;
  if (props.income) {
    incomes = props.income.income.map((element, index) => (
      <ListContainer key={index} title={element.team}>
        {element.persons.map(person => (
          <ListEl
            cash={person.value}
            title={`${person.name} ${person.surname}`}
          />
        ))}
      </ListContainer>
    ));
  }
  return <div>{incomes}</div>;
};

export default Code;
