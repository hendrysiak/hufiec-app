import React, { Component } from "react";
import { connect } from "react-redux";
import ListEl from "../ListEl/ListEl";
import axios from "../../axios-income";

class Team extends Component {
  componentDidMount = async () => {
    try {
      const response = await axios.get("/codes.json");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  getTeam = () => {
    const teams = this.props.teams;
    const incomes = teams.filter(item =>
      item.id == this.props.teamNum ? item.income : false
    );
    return incomes;
  };
  render() {
    return (
      <div>
        <ul>
          {this.getTeam()[0].income.map((item, index) => (
            <ListEl key={index} title={item.title} cash={item.cash} />
          ))}
        </ul>
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

export default connect(mapStateToProps, null)(Team);
