import React, { Component } from "react";

import { connect } from "react-redux";

import classes from "./Dashboard.module.css";
import StandardView from "../StandardView/StandardView";
import ImportIncome from "../ImportIncome/ImportIncome";

import * as actions from "../../store/actions/index";

class Dashboard extends Component {
  downloadIncome = () => {
    const url =
      "https://gist.githubusercontent.com/hendrysiak/9b7f2fa73d9384e3c412fcab3f8cff6c/raw/8eee22684e05fe23d515f3aa3676894ff2583191/xml-convert";
    this.props.onFetchIncome(url);
  };
  render() {
    return (
      <div className={classes.GridArea}>
        <header className={classes.Header}>
          <button onClick={this.downloadIncome}>Zaimportuj przelewy</button>
        </header>
        <aside className={classes.Aside}>
          <ul className={classes.List}>
            <li className={classes.ListElement}>IMPORT PRZELEWÓW</li>
            <li className={classes.ListElement}>PRZELEWY ZAIMPORTOWANE</li>
            <li className={classes.ListElement}>PRZELEWY NIEPRZYPISANE</li>
            <li className={classes.ListElement}>FILTRUJ PO KODZIE</li>
            <li className={classes.ListElement}>FILTRUJ PO DRUŻYNE</li>
            <li className={classes.ListElement}>DODAJ KOD</li>
            <li className={classes.ListElement}>DODAJ ROZLICZENIE</li>
            <li className={classes.ListElement}>POKAŻ BAZĘ</li>
          </ul>
        </aside>
        {/* <StandardView class={classes.Main} /> */}
        <ImportIncome class={classes.Main} />
        <footer className={classes.Footer}></footer>
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
    onSortIncome: (actualTeams, actualIncome) =>
      dispatch(actions.sortingIncome(actualTeams, actualIncome))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
