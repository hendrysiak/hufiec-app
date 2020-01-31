import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "axios";

import ListContainer from "../../components/ListContainer/ListContainer";
import ListEl from "../../components/ListEl/ListEl";

import * as actions from "../../store/actions/index";

class StandardView extends Component {
  state = {
    loading: false,
    income: null
  };

  componentDidMount = () => {
    this.setState({ income: this.props.init });
    console.log(this.state.income);
  };

  downloadIncome = () => {
    this.setState({ income: this.props.init });
    console.log(this.state.income);
  };

  verifyTeams = () => {
    this.props.onSortIncome(this.props.teams, this.props.init);
    console.log(this.props.teams);
  };

  showNonAssignedIncomes = () => {
    const actualTeams = [...this.props.teams];
    const actualIncome = [...this.props.init];

    const regexArr = actualTeams.map(
      element => new RegExp(`(${element.id})`, "m")
    );
    regexArr.splice(regexArr.length - 1, 1);

    const notPassValue = actualIncome.filter(info =>
      regexArr.every(item => !item.test(info.title))
    );
    console.log(notPassValue);
    return notPassValue;
  };

  editIncome = (event, index) => {
    const incomeToEdit = [...this.props.init];
    console.log(event.target.value);
    console.log(incomeToEdit[index].title);
    incomeToEdit[index].title = event.target.value;
    console.log(incomeToEdit[index].title);
    this.setState({ income: incomeToEdit });
    // this.props.onEditIncome(incomeToEdit);
  };

  showIncome = () => {
    const patterns = [...this.props.teams].map(
      el => new RegExp(`/${el.id}/`, "m")
    );
    console.log(patterns);
    // const coloredIncome = [...this.props];
  };

  render() {
    // let listOfIncome = this.props.teams.map((element, index) => (
    //   <ListContainer key={index} title={element.id}>
    //     {element.income.map((item, index) => (
    //       <ListEl key={index} title={item.title} cash={item.cash} />
    //     ))}
    //   </ListContainer>
    // ));

    // let listOfOutcome = this.props.teams[
    //   this.props.teams.length - 1
    // ].income.map((element, index) => {
    //   if (element.cash * 1 < 0) {
    //     return <ListEl key={index} title={element.title} cash={element.cash} />;
    //   }
    // });

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
      <main className={this.props.class}>
        <h2>Przelewy zaimportowane:</h2>
        {listOfIncome}

        {/* <div>
          <h2>Wpływy</h2>
          {listOfIncome}
        </div>
        <div>
          <h2>Wydatki</h2>
          {listOfOutcome}
        </div>
        <div>
          <h2>Wpływy nieprzypisane</h2>
          {listOfNonAssignedIncome}
        </div> */}
        <button onClick={this.downloadIncome}>Pobież przelewy</button>
      </main>
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

export default connect(mapStateToProps, mapDispatchToProps)(StandardView);
