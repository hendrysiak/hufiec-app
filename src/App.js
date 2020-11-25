import React, { Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import { Route } from "react-router-dom";

import { useSelector } from "react-redux";

import Navigation from "./components/Navigation/Navigation";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import * as actions from './store/actions/index';
import store from './store/store';

import CircularProgress from '@material-ui/core/CircularProgress';

import { getTeamsWithAccountState, getCodes, getRegistry } from '../src/containers/DashBoard/api-handlers/account.handler';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import GroupIcon from '@material-ui/icons/Group';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import EditIcon from '@material-ui/icons/Edit';
import TableChartIcon from '@material-ui/icons/TableChart';

const App = () => {
//TODO registry, dbincomes and outcomes dependency
  const loadingStatus = useSelector(state => state.ui.loading);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const menu = useRef()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    document.body.addEventListener('click', (event) => {
      if (event.currentTarget !== menu) handleClose();
    })
  },[])

  useEffect(() => {
    // store.dispatch(actions.loadingStart);
    const downloadData = async () => {
      await getTeamsWithAccountState();
      await getCodes();
      await getRegistry();
    }
    downloadData();
    store.dispatch(actions.loadingEnd());
  },[]);

  const DashBoard = React.lazy(() => import( "./containers/DashBoard/Dashboard"));
  const Codes = React.lazy(() => import( "./components/Codes/Codes"));
  const AddCode = React.lazy(() => import( "./components/AddCode/AddCode"));
  const Teams = React.lazy(() => import( "./components/Teams/Teams"));
  const ForCoders = React.lazy(() => import( './components/ForCoders/ForCoders'));
  const EventBilling = React.lazy(() => import( './containers/EventBilling/EventBilling'));
  const EventApproval = React.lazy(() => import( './containers/EventApproval/EventApproval'));
  const SortedIncome = React.lazy(() => import( "./containers/Transfers/components/SortedIncome/SortedIncome"));
  const UnAssignedIncome = React.lazy(() => import( "./containers/Transfers/components/UnAssignedIncome/UnAssignedIncome"));
  const ImportIncome = React.lazy(() => import( "./containers/Transfers/components/ImportIncome/ImportIncome"));
  const Edit = React.lazy(() => import( "./components/Edit/Edit"));

  const  navigation = [
    { link: "/", title: "STRONA GŁÓWNA", icon: <TableChartIcon fontSize="small" /> },
    { link: "/transfers", title: "PRZELEWY - OBSŁUGA", icon: <AttachMoneyIcon fontSize="small" /> },
    { link: "/codes", title: "FILTRUJ PO KODZIE", icon: <CodeIcon fontSize="small" /> },
    { link: "/teams", title: "FILTRUJ PO DRUŻYNIE", icon: <GroupIcon fontSize="small" /> },
    { link: "/add-code", title: "DODAJ KOD", icon: <AddBoxIcon fontSize="small" /> },
    { link: "/add-approval", title: "DODAJ ZATWIERDZENIE", icon: <PlaylistAddIcon fontSize="small" /> },
    { link: "/add-billing", title: "DODAJ ROZLICZENIE", icon: <PlaylistAddCheckIcon fontSize="small" /> },
    { link: "/editor", title: "EDYTUJ PRZYCHODY/KOSZTY", icon: <EditIcon fontSize="small" />  },
  ]

  const routes = (
    <BrowserRouter>
        <Container maxWidth="xl" style={{height: '100%'}}>
          <Grid container spacing={3} alignItems="stretch" alignContent="stretch">


          <Grid item xs={12} md={8} lg={12}> 
        <div>
         
          <Switch>
            <Route exact path="/" render={() => <DashBoard />} />
            <Route exact path="/transfers" render={() => <ImportIncome />} />
            <Route exact path="/transfers/imported" render={() => <UnAssignedIncome />} />
            <Route exact path="/transfers/sorted" render={() => <SortedIncome />} />
            {/* <Route exact path="/transfers/sorted/:teamId" render={() => <SortedIncome />} /> */}
            <Route exact path="/codes" render={() => <Codes />} />
            <Route exact path="/add-code" render={() => <AddCode/>} />
            <Route exact path="/teams" render={() => <Teams />} />
            {/* <Route exact path="/:teamId" render={() => <Team />} /> */}
            <Route exact path="/add-approval" render={() => <EventApproval />} />
            <Route exact path="/add-billing" render={() => <EventBilling />} />
            <Route exact path="/for-coders" render={() => <ForCoders/>} />
            <Route exact path="/editor" render={() => <Edit />} />
            {/* <Route exact path={`/transfers/sorted/:teamId`} render={(rp) => <Team teamNum={rp.match.params.title} />}/> */}
          </Switch>
          
      </div>
      </Grid>
      </Grid>
      </Container>
    </BrowserRouter>
  );

  return (
    <div className="App">
      <div className="Nav">
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="Nav__menu"
        
      >
        <MoreVertIcon />
      </IconButton>
      </div>
      <Navigation
         list={navigation}
         anchorEl={anchorEl}
         open={open}
         onClose={handleClose}
         ref={menu}
         />
          {loadingStatus 
          ? <div className="loader"><CircularProgress/></div>
          : (<div>
              <Suspense fallback={<div className="loader"><CircularProgress/></div>}>{routes}</Suspense>
            </div>)}
    </div>
    );

}

export default App;
