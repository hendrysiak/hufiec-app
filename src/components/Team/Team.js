import React, { Component } from "react";
import { connect } from "react-redux";

class Team extends Component {
  componentDidMount = () => {
    console.log(this.props.teams);
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
            <li key={index}>{item.title}</li>
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
