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
  const codes = useSelector(state => state.income.codes);
  const dbOutcomes = useSelector(state => state.income.dbOutcomes);

  const [isLoading, setLoadingStatus] = useState(false);
  const [currentCodes, setCurrentCodes] = useState(codes);

  useEffect(() => {
    const onlyCodes = codes.map(code => code.code)
    setCurrentCodes(onlyCodes);
  }, [codes]);

    return (
      <section className="Section">
      <header>
        <nav className="Nav">
          <Navigation list={props.codesMenu} />
        </nav>
        <h2>Dodaj rozliczenie do kodu</h2>
      </header>
      <main className={classes.Main}>{}</main>
      </section>
    );
}


export default EventBilling;
