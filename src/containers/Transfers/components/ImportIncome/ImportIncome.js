import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/index";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import classes from "./ImportIncome.module.css";

import store from "../../../../store/store";

class ImportIncome extends Component {
  setUrl = event => {
    event.preventDefault();
    store.dispatch(actions.fetchIncome(event.target.children[1].value));
  };

  render() {
    let spinner;
    if (this.props.loading) {
      spinner = <Spinner />;
    }
    return (
      <section className="Section">
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