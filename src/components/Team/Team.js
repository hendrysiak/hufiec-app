import React, { Component } from "react";
import { connect } from "react-redux";
import ListEl from "../ListEl/ListEl";
import ListContainer from "../ListContainer/ListContainer";
import axios from "../../axios-income";

class Team extends Component {
  componentDidMount = async () => {
    try {
      const response = await axios.get("/codes.json");
      console.log(response);
      console.log(this.props.incomes);
    } catch (err) {
      console.log(err);
    }
  };

  getTeam = () => {
    const teams = this.props.incomes;
    const incomes = teams.filter(item =>
      item.id == this.props.teamNum ? item.accounts : false
    );
    return incomes;
  };
  render() {
    return (
      <div>
        <ul>
          {this.getTeam()[0].accounts.map((item, index) => (
            <ListContainer key={index} title={item.code}>
              {item.incomeByCode.map((income, index) => (
                <ListEl key={index} title={income.title} cash={income.cash} />
              ))}
            </ListContainer>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    init: state.income.initIncome,
    teams: state.income.teams,
    incomes: state.income.assignedIncome
  };
};

export default connect(mapStateToProps, null)(Team);
