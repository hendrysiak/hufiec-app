import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import Spinner from "../UI/Spinner/Spinner";
import classes from "./ImportIncome.module.css";

class ImportIncome extends Component {
  setUrl = event => {
    event.preventDefault();
    this.props.onFetchIncome(event.target.children[1].value);
  };

  render() {
    let spinner;
    if (this.props.loading) {
      spinner = <Spinner />;
    }
    return (
      <section className="Section">
        <p>
          Chwilowo skopiuj to:
          https://gist.githubusercontent.com/hendrysiak/9b7f2fa73d9384e3c412fcab3f8cff6c/raw/8eee22684e05fe23d515f3aa3676894ff2583191/xml-convert
        </p>
        <form className={classes.Form} onSubmit={event => this.setUrl(event)}>
          <h2>Wstaw URL z importem XML</h2>
          <input type="text" className={classes.Input} />
          <button type="submit" className={classes.Button}>
            Importuj
          </button>
        </form>
        {spinner}
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.income.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchIncome: url => dispatch(actions.fetchIncome(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportIncome);
