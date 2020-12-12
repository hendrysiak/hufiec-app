
import { TextField, MenuItem } from '@material-ui/core';


import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

// import { mainListItems, secondaryListItems } from './listItems';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


import Navigation from 'shared/Navigation/Navigation';

import axios from 'axios-income';
import * as actions from 'store/actions/index';
import store from 'store/store';

import EventInfo from './components/EventInfo';

import EventOutcomes from './components/EventOutcomes';
import classes from './EventBilling.module.css';

const EventBilling = (props) => {
  const codes = useSelector(state => state.income.codes);
  const dbOutcomes = useSelector(state => state.income.dbOutcomes);

  const [usedCodes, setUsedCodes] = useState(codes);
  const [usedOutcomes, setUsedOutcomes] = useState([]);
  const [editedOutcomes, setEditedOutcomes] = useState([]);
  const [currentCode, setCurrentCode] = useState();
  const [incomesByCode, setIncomesByCode] = useState();
  const [currentOutcome, setCurrentOutcome] = useState();
  
  const [newOutcomes, setNewOutcomes] = useState([]);

  useEffect(() => {
    if (codes) {
      const filteredCodes = codes.filter(c => {
        if (c.approvalInfo) return true;
        else return false;
      });
      setCurrentCode(filteredCodes[0]);
      setUsedCodes(filteredCodes);
    }
  }, [codes]);

  useEffect(() => {
    const usedIncome = store.getState().income.dbIncomes;
    const filteredIncome = usedIncome && usedIncome.filter(i => i.event === currentCode);
    setIncomesByCode(filteredIncome);
  }, [currentCode]);

  const drawerWidth = 240;

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    fixedHeight: {
      height: 240,
    },
  }));

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  

  return (
    <>
      <Navigation />
      <section className="Section">
        <header>

        </header>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="xl" className={classes.container}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                {/* <Paper className={fixedHeightPaper}> */}
                <h2>Dodaj rozliczenie do kodu</h2>
                <TextField
                  style={{ width: '40%' }}
                  label="Wybierz kod imprezy do rozliczenia"
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  placeholder="Wybierz kod z listy"
                  select={true}
                  size="small"
                  variant="outlined"
                  margin="normal"
                  SelectProps={{
                    MenuProps: { disableScrollLock: true }
                  }}
                >
                  {usedCodes && [...usedCodes.map(code => code.code)].map((item) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))}
                </TextField>
                {/* </Paper> */}
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                {/* <Paper className={fixedHeightPaper}> */}
                <EventInfo title={currentCode || 'Wybierz imprezę'} cash={5000}/>
                {/* </Paper> */}
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={11}>
                <EventOutcomes/>
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Dodaj wydatek do imprezy"><IconButton><AddIcon onClick={() => console.log('Dodaję')}/></IconButton></Tooltip>
              </Grid>
            </Grid>
            <Box pt={4}>
              {/* <Copyright /> */}
            </Box>
          </Container>
        </main>
      </section>
    </>
  );
};


export default EventBilling;
