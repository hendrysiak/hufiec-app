
import { TextField, MenuItem, Button, Paper, Typography, ListItemText, ListItem } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


import axios from 'axios-income';
import { ApprovedEvent } from 'models/codes.models';
import { FinanceMethod, FoundingSources, OutcomeCategory } from 'models/global.enum';
import { IncomePurpose, IncomesWithImportDate, OutcomesWithEvent } from 'models/income.models';
import Navigation from 'shared/Navigation/Navigation';

import { RootState } from 'store/models/rootstate.model';
import store from 'store/store';

import EventInfo from './components/EventInfo';

import EventOutcomes from './components/EventOutcomes';
import classes from './EventBilling.module.css';

const EventBilling = (): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

  const [usedCodes, setUsedCodes] = useState<ApprovedEvent[] | null>(codes);
  const [usedOutcomes, setUsedOutcomes] = useState<OutcomesWithEvent[]>([]);

  const [cashToBiling, setCachToBiling] = useState<number>(0);

  // const [editedOutcomes, setEditedOutcomes] = useState([]);
  const [currentCode, setCurrentCode] = useState<string>();
  const [incomesByCode, setIncomesByCode] = useState<IncomesWithImportDate[]>();
  // const [currentOutcome, setCurrentOutcome] = useState();
  
  // const [newOutcomes, setNewOutcomes] = useState([]);
  const [modalToAddOutcomeVisible, setModalToAddOutcomeVisibility] = useState<boolean>(false);

  //Add outcome from account handlers - to move to another component
  const [modalToAddAccountOutcome, setModalToAddAccountOutcomeVisibility] = useState<boolean>(false);
  const [choosedOutcomes, setChoosedOutcomes] = useState<OutcomesWithEvent[]>([]);
  const [editedIndex, setEditedIndex] = useState(-1);

  useEffect(() => {
    if (codes) {
      const filteredCodes = codes.filter(c => {
        if (c.approvalInfo) return true;
        else return false;
      });

      if (filteredCodes) {
        const getApprovalinfo = async () => {
          const approvalInfo = await axios.get(`/approval/${filteredCodes[0].approvalInfo}.json`);
          const currentEventApprovalCash 
          = approvalInfo.data.incomes.reduce((sum: number, element: IncomePurpose) => sum + element.cash, 0);

          setCachToBiling(currentEventApprovalCash);
        };
        getApprovalinfo();
        setCurrentCode(filteredCodes[0].code);
      } 
      setUsedCodes(filteredCodes);
    }
  }, [codes]);

  useEffect(() => {
    const currentEventOutcomesFromDB = dbOutcomes?.filter(o => o.event && o.event === currentCode);
    currentEventOutcomesFromDB && setUsedOutcomes(currentEventOutcomesFromDB);
  }, [dbOutcomes]); 

  const handleChoosingOutcomes = (title: string): void => {
    const copiedOutcomes = [...choosedOutcomes];
    const foundedOutcome = dbOutcomes?.find(o => o.title === title);
    foundedOutcome && copiedOutcomes.push(foundedOutcome);

    setChoosedOutcomes(copiedOutcomes);
  };

  const handleAddAccountOutcomeToBiling = (): void => {
    const accountOutcome = choosedOutcomes.map(co => {
      return { ...co, event: currentCode || null };
    });

    setUsedOutcomes([...usedOutcomes, ...accountOutcome]);
    setModalToAddAccountOutcomeVisibility(false);
    setModalToAddOutcomeVisibility(false);
  };

  const handleClose = () => {
    setEditedIndex(-1);
  };

  const handleAddCachOutcomeToBiling = (): void => {
    const newCachOutcome: OutcomesWithEvent = {
      bilingNr: null,
      cash: 0,
      event: currentCode || null,
      title: 'Koszt wprowadzony ręcznie',
      team: '',
      dateOfBook: new Date().toLocaleString().split(',')[0],
      importDate: new Date().toLocaleString().split(',')[0],
      financeMethod: FinanceMethod.Cash,
      foundingSources: FoundingSources.Other,
      outcomeCategory: OutcomeCategory.Materials
    };

    setUsedOutcomes([...usedOutcomes, newCachOutcome]);
    setModalToAddOutcomeVisibility(false);
  };

  const handleEditOutcome = (index: number, data: { key: string, value: string | number }) => {
    const outcomeToUpdate = [...usedOutcomes];
    outcomeToUpdate[index][data.key] = data.value;

    setUsedOutcomes(outcomeToUpdate);
  };

  const handleDeleteOutcome = (index: number) => {
    const outcomeToUpdate = [...usedOutcomes];
    outcomeToUpdate.splice(index, 1);

    setUsedOutcomes(outcomeToUpdate);
  };

  const cashToDisplay 
  = cashToBiling 
  - usedOutcomes.reduce((sum: number, uo: OutcomesWithEvent) => sum - uo.cash, 0);

  const outcomesOptions = dbOutcomes && [...dbOutcomes
    .filter(dbO => dbO.event !== currentCode)
    .filter(o => !choosedOutcomes
      .map(co => co.title)
      .includes(o.title))
    .map(o => o.title)];

  return (
    <>
      <Navigation />
      <Modal 
        open={modalToAddOutcomeVisible}  
        onClose={() => setModalToAddOutcomeVisibility(false)}>
        <div className="biling__modal--add-outcome">
          <Button variant="contained" color="primary" onClick={() => setModalToAddAccountOutcomeVisibility(true)}>Dodaj koszt z konta</Button>
          <Button variant="contained" color="primary" onClick={() => handleAddCachOutcomeToBiling()}>Dodaj koszt gotówkowy</Button>
        </div>
      </Modal>
      <Modal 
        open={modalToAddAccountOutcome}  
        onClose={() => setModalToAddAccountOutcomeVisibility(false)}>
        <Paper className="biling__modal--account">
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Wybierz koszt z listy, aby dopasować go do imprezy:
          </Typography>
          <TextField
            style={{ width: '40%' }}
            label="Wybierz kod imprezy do rozliczenia"
            value={currentCode}
            onChange={(e) => handleChoosingOutcomes(e.target.value)}
            placeholder="Wybierz przelewy z listy"
            select={true}
            size="small"
            variant="outlined"
            margin="normal"
            SelectProps={{
              MenuProps: { disableScrollLock: true }
            }}
          >
            {outcomesOptions && outcomesOptions.map((item) => (
              <MenuItem key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
          <List style={{ height: '200px', overflowY: 'auto' }}>
            {choosedOutcomes.map((co, index) => {
              return <ListItem button key={index}>
                <ListItemText primary={co.title} />
              </ListItem>;
            })}
          </List>
          <Button variant="contained" color="primary" onClick={() => handleAddAccountOutcomeToBiling()}>Dodaj koszty do rozliczenia</Button>
        </Paper>
      </Modal>
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
                <EventInfo 
                  title={currentCode || 'Wybierz imprezę'} 
                  cash={cashToDisplay}/>
                {/* </Paper> */}
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={11}>
                <EventOutcomes 
                  rows={usedOutcomes}
                  onChange={handleEditOutcome}
                  onClose={handleClose}
                  editedIndex={editedIndex}
                  onEdit={setEditedIndex}
                  onDelete={handleDeleteOutcome}
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Dodaj wydatek do imprezy"><IconButton><AddIcon onClick={() => setModalToAddOutcomeVisibility(true)}/></IconButton></Tooltip>
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
