import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ListEl from "../../../../components/ListEl/ListEl";
import ListContainer from "../../../../components/ListContainer/ListContainer";

import * as actions from "../../../../store/actions/index";

import { useHistory } from "react-router-dom";

import store from "../../../../store/store";

const UnAssignedIncome = () => {

  const initIncome = useSelector(state => state.income.initIncome)
  const registry = useSelector(state => state.income.registry)

  const [currentIncome, setCurrentIncome] = useState([]);

  const history = useHistory();

  useEffect(() => {
    setCurrentIncome(initIncome)
  }, [initIncome])

  const verifyTeams = () => {
    history.push('/transfers/sorted')
  };


  const editIncome = (event, index) => {
    const incomeToEdit = [...initIncome];
    incomeToEdit[index].title = event.target.value;
    setCurrentIncome(incomeToEdit);
  };

  const updateIncome = () => {
    store.dispatch(actions.editingIncome(currentIncome))
  };


    let listOfIncome;
    if (currentIncome && registry) {
      listOfIncome = currentIncome.map((element, index) => {
        const patterns = [...Object.keys(registry)].map(
          el => new RegExp(`${el}`, "m")
        );
        patterns.splice(patterns.length - 1, 1);
        if (patterns.some(item => item.test(element.title))) {
          return (
            <ListEl
              key={index}
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
      <section className="Section">
        <div>
          <button onClick={() => updateIncome()}>Zaktualizuj przelewy</button>
          <button onClick={() => verifyTeams()}>Posortuj przelewy</button>
          <h2>Przelewy zaimportowane:</h2>
        </div>
        <ListContainer>{listOfIncome}</ListContainer>
      </section>
    );
}

// const mapStateToProps = state => {
//   return {
//     init: state.income.initIncome,
//     teams: state.income.teams
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onFetchIncome: url => dispatch(actions.fetchIncome(url)),
//     onSortIncome: (actualTeams, actualIncome) =>
//       dispatch(actions.sortingIncome(actualTeams, actualIncome)),
//     onEditIncome: income => dispatch(actions.editingIncome(income))
//   };
// };

export default UnAssignedIncome;
