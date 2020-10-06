import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";
import Code from "./Code/Code";

import { getInfo } from '../../helpers/getInfo';

import classes from "./Codes.module.css";

const Codes = (props) => {
  const accounts = useSelector(state => state.income.accountList);
  const accountState = useSelector(state => state.income.accountList).find(a => a.code === props.code);
  const codes = useSelector(state => state.income.codes);
  // const [infoAboutIncomes, setInfoAboutIncome] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);

  console.log(props.codesMenu);

  let spinner;
  if (isLoading) spinner = <Spinner />;


  return (
    <section className="Section">
      <header>
        <nav className="Nav">
          <Navigation list={props.codesMenu} />
        </nav>
        <h2>Pokaż listę po kodzie</h2>
        {spinner}
      </header>
      <main className={classes.Main}>{props.routing}</main>
    </section>
  );
};

export default Codes;
