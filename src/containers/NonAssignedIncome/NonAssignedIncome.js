import React, { Component } from "react";
import { connect } from "react-redux";

import ListEl from "../../components/ListEl/ListEl";

import * as actions from "../../store/actions/index";

class NonAssignedIncome extends Component {
  state = {
    income: null
  };

  componentDidMount = () => {
    this.setState({ income: this.props.init });
  };

  verifyTeams = () => {
    this.props.onSortIncome(this.props.teams, this.props.init);
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

  editIncome = (event, index) => {
    const incomeToEdit = [...this.props.init];
    incomeToEdit[index].title = event.target.value;
    this.setState({ income: incomeToEdit });
  };

  updateIncome = () => {
    this.props.onEditIncome(this.state.income);
  };

  render() {
    let listOfIncome;
    if (this.state.income) {
      listOfIncome = this.state.income.map((element, index) => {
        const patterns = [...this.props.teams].map(
          el => new RegExp(`(${el.id})`, "m")
        );
        patterns.splice(patterns.length - 1, 1);
        if (patterns.some(item => item.test(element.title))) {
          return (
            <ListEl
              color="green"
              key={index}
              title={element.title}
              cash={element.cash}
              clicked={event => this.editIncome(event, index)}
            />
          );
        } else {
          return (
            <ListEl
              color="red"
              key={index}
              title={element.title}
              cash={element.cash}
              clicked={event => this.editIncome(event, index)}
            />
          );
        }
      });
    }

    return (
      <section className="Section">
        <div>
          <h2>Przelewy zaimportowane:</h2>
          <button onClick={this.updateIncome}>Zaktualizuj przelewy</button>
          <button onClick={this.verifyTeams}>Posortuj przelewy</button>
        </div>
        {listOfIncome}
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    init: state.income.initIncome,
    teams: state.income.teams
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchIncome: url => dispatch(actions.fetchIncome(url)),
    onSortIncome: (actualTeams, actualIncome) =>
      dispatch(actions.sortingIncome(actualTeams, actualIncome)),
    onEditIncome: income => dispatch(actions.editingIncome(income))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NonAssignedIncome);
