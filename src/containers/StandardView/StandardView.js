import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "axios";

import ListContainer from "../../components/ListContainer/ListContainer";
import ListEl from "../../components/ListEl/ListEl";

import * as actions from "../../store/actions/index";

class StandardView extends Component {
  state = {
    loading: false
  };

  componentDidMount = () => {
    const url =
      "https://gist.githubusercontent.com/hendrysiak/9b7f2fa73d9384e3c412fcab3f8cff6c/raw/8eee22684e05fe23d515f3aa3676894ff2583191/xml-convert";
    this.props.onFetchIncome(url);
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

  editIncome = event => {
    console.log(event.target);
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

    let listOfNonAssignedIncome;
    if (this.props.init) {
      listOfNonAssignedIncome = this.showNonAssignedIncomes().map(
        (element, index) => {
          if (element.cash * 1 > 0) {
            return (
              <ListEl
                key={index}
                title={element.title}
                cash={element.cash}
                clicked={event => this.editIncome(event)}
              />
            );
          }
        }
      );
    }

    const style = { display: "flex", flexDirection: "row" };

    return (
      <div style={style}>
        <div>
          <h2>Nie rozpoznałem tych przelewów:</h2>
          {listOfNonAssignedIncome}
        </div>
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
        {/* <button onClick={this.showNonAssignedIncomes}>
          Pokaż wartości niepasujące
        </button> */}
      </div>
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
    onSortIncome: (actualTeams, actualncome) =>
      dispatch(actions.sortingIncome(actualTeams, actualncome))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardView);
