import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ListEl from "../../../../components/ListEl/ListEl";
import ListContainer from "../../../../components/ListContainer/ListContainer";

import * as actions from "../../../../store/actions/index";

import { useHistory } from "react-router-dom";

import store from "../../../../store/store";

const NonAssignedIncome = () => {

  const initIncome = useSelector(state => state.income.initIncome)
  const teams = useSelector(state => state.income.teams)

  const [currentIncome, setCurrentIncome] = useState([]);

  const history = useHistory();

  useEffect(() => {
    setCurrentIncome(initIncome)
  }, [initIncome])

  const verifyTeams = () => {
    store.dispatch(actions.sortingIncome(teams, currentIncome));
    history.push('/transfers/sorted')
  };

  // showNonAssignedIncomes = () => {
  //   const actualTeams = [...this.props.teams];
  //   const actualIncome = [...this.props.init];

  //   const regexArr = actualTeams.map(
  //     element => new RegExp(`(${element.id})`, "m")
  //   );
  //   regexArr.splice(regexArr.length - 1, 1);

  //   const notPassValue = actualIncome.filter(info =>
  //     regexArr.every(item => !item.test(info.title))
  //   );
  //   console.log(notPassValue);
  //   return notPassValue;
  // };

  const editIncome = (event, index) => {
    const incomeToEdit = [...initIncome];
    incomeToEdit[index].title = event.target.value;
    setCurrentIncome(incomeToEdit);
  };

  const updateIncome = () => {
    store.dispatch(actions.editingIncome(currentIncome))
  };


    let listOfIncome;
    if (currentIncome) {
      listOfIncome = currentIncome.map((element, index) => {
        const patterns = [...teams].map(
          el => new RegExp(`(${el.id})`, "m")
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

export default NonAssignedIncome;
