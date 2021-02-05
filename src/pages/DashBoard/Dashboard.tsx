import { AppBar, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios-income';

import Navigation from 'shared/Navigation/Navigation';
import { reduxIsAuthenticated } from 'store/actions/user';

import * as actions from '../../store/actions/index';
import store from '../../store/store';

import classes from './Dashboard.module.css';


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


const Dashboard = (): any => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state: any) => state.user.isAuthorization);
  const [messages, setMessages] = useState<any>();

  const getMessages = async () => {
    const result = await axios.get('/ticket.json');
    return setMessages(result.data);
  };


  // const [accountState, setAccountState] = useState({});
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    token && !isAuth && dispatch(reduxIsAuthenticated(true));

    
    getMessages();
  },[]);

  useEffect(() => {
    messages && console.log(new Map(messages));
  },[messages]);

  return (
    <>
      <Navigation />
      {isLoading 
        ? <div className="loader"><CircularProgress/></div>
        : <div>
          <h1>Aplikacja Hufcowa - v. 0.1</h1>
          <Paper>
            <AppBar position="static" className={classes.appBar}>
              <h2>Stan hufca:</h2>
              <p>kwota zł</p>
            </AppBar>
            {/* <p><strong>Przychody:</strong>{accountState.incomesAccountState}</p>
            <p><strong>Koszty:</strong>{accountState.outcomesAccountState}</p>
            <hr/>
            <p><strong>Stan hufca:</strong>{accountState.incomesAccountState - accountState.outcomesAccountState}</p> */}
            <AppBar position="static">
              {console.log(messages)}
              <h2>Wiadomości</h2>
              {typeof messages === 'object' ? Object.keys(messages).map((el:any, i:any) => console.log(el)) : null
              
              }
            </AppBar>
          </Paper>
        </div>
      }
    </>
  );
  
};


export default Dashboard;
