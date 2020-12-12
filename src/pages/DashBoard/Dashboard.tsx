import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import React, { Component, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Navigation from 'shared/Navigation/Navigation';

import * as actions from '../../store/actions/index';
import store from '../../store/store';


// import classes from "./Dashboard.module.css";

// import Navigation from "../../components/Navigation/Navigation";
// import Transfers from "../Transfers/containers/Transfers";
// import Codes from "../../components/Codes/Codes";
// import AddCode from "../../components/AddCode/AddCode";
// import Teams from "../../components/Teams/Teams";
// import ForCoders from '../../components/ForCoders/ForCoders';

// import * as actions from "../../store/actions/index";

// import { getTeamsWithAccountState, getCodes } from './api-handlers/account.handler'
// import EventBilling from "../EventBilling/containers/EventBilling";

// import { organizationStateVerification } from './helpers/dashboard.helpers';


const Dashboard = (): JSX.Element => {

  const [accountState, setAccountState] = useState({});
  const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setAccountState(organizationStateVerification())
  //     setLoading(false);
  //   }, 3000);
  // }, [])
   
  return (
    <>
      <Navigation />
      {isLoading 
        ? <div className="loader"><CircularProgress/></div>
        : <div>
          <h1>Aplikacja Hufcowa - v. 0.1</h1>
          <Paper>
            <h2>Stan hufca:</h2>
            {/* <p><strong>Przychody:</strong>{accountState.incomesAccountState}</p>
            <p><strong>Koszty:</strong>{accountState.outcomesAccountState}</p>
            <hr/>
            <p><strong>Stan hufca:</strong>{accountState.incomesAccountState - accountState.outcomesAccountState}</p> */}
          </Paper>
        </div>
      }
    </>
  );
  
};


export default Dashboard;
