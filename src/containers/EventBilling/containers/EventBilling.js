import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import Navigation from "../../../components/Navigation/Navigation";

import axios from "../../../axios-income";

import * as actions from "../../../store/actions/index";

import classes from "./EventBilling.module.css";

import { getInfo } from '../../../helpers/getInfo';

import Spinner from "../../../components/UI/Spinner/Spinner";

import Event from "../components/Event/Event";

const EventBilling = (props) => {
  const accounts = useSelector(state => state.income.accountList);
  const codes = useSelector(state => state.income.codes);

  const [isLoading, setLoadingStatus] = useState(false);

console.log(props);

let spinner;
if (isLoading) spinner = <Spinner />;
// let codesMenu = [];
// if (codes) {
//   codesMenu = codes.map(code => {
//     return { link: `/add-billing/${code}`, title: `${code}` };
//   });
// }
// let routing;
// if (accounts.length) {
//   routing = accounts.map((item, index) => {
//     return (
//       <Route
//         key={index}
//         path={`/add-billing/${item.code}`}
//         component={() => <Event income={item} />}
//       />
//     );
//   });
// }

    return (
      <section className="Section">
      <header>
        <nav className="Nav">
          <Navigation list={props.codesMenu} />
        </nav>
        <h2>Dodaj rozliczenie do kodu</h2>
        {spinner}
      </header>
      <main className={classes.Main}>{props.routing}</main>
      </section>
    );
}


export default EventBilling;
