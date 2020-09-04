import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";
import Code from "./Code/Code";

import { getInfo } from '../../helpers/getInfo';

import classes from "./Codes.module.css";

const Codes = () => {
  const accounts = useSelector(state => state.income.accountList);
  const codes = useSelector(state => state.income.codes);
  // const [infoAboutIncomes, setInfoAboutIncome] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);


  let spinner;
  if (isLoading) spinner = <Spinner />;
  let codesMenu = [];
  if (codes) {
    codesMenu = codes.map(code => {
      return { link: `/codes/${code}`, title: `${code}` };
    });
  }
  let routing;
  if (accounts.length) {
    routing = accounts.map((item, index) => {
      return (
        <Route
          key={index}
          path={`/codes/${item.code}`}
          component={() => <Code income={item} />}
        />
      );
    });
  }

  return (
    <section className="Section">
      <header>
        <nav className="Nav">
          <Navigation list={codesMenu} />
        </nav>
        <h2>Pokaż listę po kodzie</h2>
        {spinner}
      </header>
      <main className={classes.Main}>{routing}</main>
    </section>
  );
};

export default Codes;
