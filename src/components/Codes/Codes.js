import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";
import Code from "./Code/Code";

import classes from "./Codes.module.css";

const Codes = () => {
  const [accounts, getAccountsFromServer] = useState([]);
  const [codes, getCodesFromServer] = useState(null);
  // const [infoAboutIncomes, setInfoAboutIncome] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);

  const getInfo = async () => {
    const codes = await axios.get("/codes.json");
    let codesList = [];
    for (let code in codes.data) {
      await codes.data[code].forEach(code => codesList.push(code));
    }
    const accounts = await axios.get("/teams.json");
    let accountList = []; // init empty array
    for (let team in accounts.data) {
      // iteration by all teams
      for (let code in accounts.data[team]) {
        // for each code in team
        let index = accountList.findIndex(item => item.code === code); // get index, if exist
        //if index exist, assign new incomes to existing code
        if (index > -1) {
          accountList[index].income = [
            ...accountList[index].income,
            { team, persons: [...accounts.data[team][code]] }
          ];
        } else {
          // if index doesn't exist, push new object with code
          accountList.push({
            code,
            income: [{ team, persons: [...accounts.data[team][code]] }]
          });
        }
      }
    }
    await getAccountsFromServer(accountList);
    await getCodesFromServer(codesList);
  };

  useEffect(() => {
    setLoadingStatus(true);
    try {
      getInfo();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

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
