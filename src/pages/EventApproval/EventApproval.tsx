import { TextField, MenuItem, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import axios from 'axios-income';
import { ApprovedEvent, Event } from 'models/codes.models';
import { BudgetEntry } from 'models/global.enum';
import { IncomePurpose, OutcomePurpose } from 'models/income.models';

import { reduxGetCodes } from 'store/actions/income';
import { RootState } from 'store/models/rootstate.model';
import store from 'store/store';

const EventApproval = (): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes);

  const [newIncomes, setNewIncomes] = useState<IncomePurpose[]>([]);
  const [newOutcomes, setNewOutcomes] = useState<OutcomePurpose[]>([]);
  const [currentCode, setCurrentCode] = useState<string>();
  const [usedCodes, setUsedCodes] = useState<ApprovedEvent[]>();

  const eventSummary 
    = newIncomes.reduce((a,b) => a + Number(b.cash), 0) 
    - newOutcomes.reduce((a,b) => a + Number(b.cash), 0);

  useEffect(() => {
    if (codes) {
      setCurrentCode(codes.map(code => code.code)[0]);
      const filteredCodes = codes.filter((c: ApprovedEvent) => {
        if (c.approvalInfo) return false;
        else return true;
      });
      setUsedCodes(filteredCodes);
    }
  }, [codes]);

  const createIncome = () => {
    const income = { cash: '', source: '' };
    const updatedIncomes = [...newIncomes];
    income && updatedIncomes.push(income);
    setNewIncomes(updatedIncomes);
  };

  const createOutcome = () => {
    const outcome = { cash: '', purpose: '' };
    const updatedOutcomes = [...newOutcomes];
    outcome && updatedOutcomes.push(outcome);
    setNewOutcomes(updatedOutcomes);
  };

  const editIncomeOrOutcome = (
    arrayOfApprovalPosition: IncomePurpose[] | OutcomePurpose[], 
    index: number, 
    data: {cash?: string; purpose?: string; source?: string;}, 
    infoAboutData: string
  ) => {
  
    const copiedArray = [...arrayOfApprovalPosition];

    if (infoAboutData === BudgetEntry.Income) {
      if (data.cash) copiedArray[index].cash = data.cash;
      if (data.source) (copiedArray as IncomePurpose[])[index].source = data.source;
      return setNewIncomes(copiedArray as IncomePurpose[]);
    }

    if (data.cash) copiedArray[index].cash = data.cash;
    if (data.purpose) (copiedArray as OutcomePurpose[])[index].purpose = data.purpose;
    return setNewOutcomes(copiedArray as OutcomePurpose[]);
  };

  const sendApproval = async () => {
    if (eventSummary < 0) return alert('Wydatki nie mogą być większe od przychodów!');
    if (eventSummary > 0) return alert('Impreza powinna być zbilansowana do 0!');
    if (!currentCode) return alert('Nie wybrano kodu!');
    if (window.confirm('Jesteś pewien, że wysyłasz zatwierdzenie? Chwilowo nie mozna go później edytować :)')) {
      const incomes = newIncomes.map(i => {
        const updatedCash = Number(i.cash.replace(',', '.'));
        return { ...i, cash: updatedCash };
      });

      const outcomes = newOutcomes.map(i => {
        const updatedCash = Number(i.cash.replace(',', '.'));
        return { ...i, cash: updatedCash };
      });

      const data = await axios.post('approval.json', { incomes, outcomes });
      if (codes) {
        const updatedCode = codes.findIndex((c: Event) => c.code === currentCode);
        const newCodes = codes.map((c: Event, index: number) => {
          if (index === updatedCode) {
            return { ...c, approvalInfo: data.data.name };
          }
          else return { ...c };
        });
        const codesAfterUpdate = await axios.put('codes.json', newCodes);
        store.dispatch(reduxGetCodes(codesAfterUpdate.data));
      };
      setNewIncomes([]);
      setNewOutcomes([]);
    }
  };

  return (
    <>
      <section className="Section">
        <Paper className="event-approbal__paper">
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Stan finansowy imprezy:
          </Typography>
          {eventSummary >= 0 
            ? <span style={{ color: 'green' }}>{`${eventSummary}`}</span> 
            : <span style={{ color: 'red' }}>{`${eventSummary}`}</span>}
        </Paper>
        <header>
          <h2>Zatwierdź imprezę finansowo</h2>
          <TextField
            style={{ width: '40%', margin: '16px 0' }}
            label="Wybierz imprezę do zatwierdzenia"
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
        </header>
        <main>
          <section>
            <h3>Przychody</h3>
            <ul>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {newIncomes && newIncomes.map((i, index) => {
                  return (
                    <div key={index} style={{ display: 'flex' }}>
                      <TextField
                        size="medium"
                        value={i.cash}
                        margin="dense"
                        onChange={
                          (e) => editIncomeOrOutcome(
                            newIncomes, 
                            index, 
                            { cash: e.target.value }, 
                            BudgetEntry.Income
                          )}
                        style={{ maxWidth: '200px', marginRight: '16px' }}
                      />
                      <TextField
                        size="medium"
                        value={i.source}
                        margin="dense"
                        onChange={
                          (e) => editIncomeOrOutcome(
                            newIncomes, 
                            index, 
                            { source: e.target.value }, 
                            BudgetEntry.Income
                          )}
                        style={{ width: '600px' }}
                      />
                    </div>
                  );
                })}
              </div>
            </ul>
            <Tooltip title="Dodaj przychód" aria-label="add-team">
              <IconButton><AddIcon onClick={() => createIncome()}/></IconButton>
            </Tooltip>
          </section>
          <section>
            <h3>Wydatki</h3>
            <ul>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {newOutcomes && newOutcomes.map((i, index) => {
                  return (
                    <div key={index} style={{ display: 'flex' }}>
                      <TextField
                        size="medium"
                        value={i.cash}
                        margin="dense"
                        onChange={(e) => editIncomeOrOutcome(
                          newOutcomes, 
                          index, 
                          { cash: e.target.value }, 
                          BudgetEntry.Outcome
                        )}
                        style={{ maxWidth: '200px', marginRight: '16px' }}
                      />
                      <TextField
                        size="medium"
                        value={i.purpose}
                        margin="dense"
                        onChange={(e) => editIncomeOrOutcome(
                          newOutcomes, 
                          index, 
                          { purpose: e.target.value }, 
                          BudgetEntry.Outcome
                        )}
                        style={{ width: '600px' }}
                      />
                    </div>
                  );
                })}
              </div>
            </ul>
            <Tooltip title="Dodaj wydatek" aria-label="add-team">
              <IconButton><AddIcon onClick={() => createOutcome()}/></IconButton>
            </Tooltip>
          </section>
        </main>
        <Button variant="contained" color="primary" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => sendApproval()}>Zapisz zatwierdzenie</Button>
      </section>
    </>
  );
};

export default EventApproval;
