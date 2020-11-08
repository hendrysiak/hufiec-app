import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import { TextField, MenuItem } from '@material-ui/core';

import Button from '@material-ui/core/Button';

import axios from "../../axios-income";

import store from '../../store/store';
import { fetchCodes } from '../../store/actions/income';

const EventApproval = (props) => {
  const codes = useSelector(state => state.income.codes);

  const [newIncomes, setNewIncomes] = useState([]);
  const [newOutcomes, setNewOutcomes] = useState([]);
  const [currentCode, setCurrentCode] = useState();
  const [usedCodes, setUsedCodes] = useState([]);

  useEffect(() => {
    if (codes) {
      setCurrentCode(codes.map(code => code.code)[0]);
      const filteredCodes = codes.filter(c => {
        if (c.approvalInfo) return false;
        else return true;
      })
      setUsedCodes(filteredCodes);
    }
  }, [codes]);

  const createIncome = () => {
    const income = {cash: '', purpose: ''}
    const updatedIncomes = [...newIncomes];
    updatedIncomes.push(income);
    setNewIncomes(updatedIncomes);
  }

  const createOutcome = () => {
    const outcome = {cash: null, purpose: ''}
    const updatedOutcomes = [...newOutcomes];
    updatedOutcomes.push(outcome);
    setNewOutcomes(updatedOutcomes);
  }

  const editData = (array, index, data, infoAboutData) => {
    console.log(array, index, data, infoAboutData);
    const copiedArray = [...array];
    if (data.cash) {
      copiedArray[index].cash = data.cash
    } else if (data.purpose) {
      copiedArray[index].purpose = data.purpose
    }
    if (infoAboutData === "income") setNewIncomes(copiedArray);
    else if (infoAboutData === "outcome") setNewOutcomes(copiedArray);
  }

  const sendApproval = async () => {
    if (!currentCode) return alert("Nie wybrano kodu!");
    if (window.confirm("Jesteś pewien, że wysyłasz zatwierdzenie? Chwilowo nie mozna go później edytować :)")) {
      const incomes = newIncomes.map(i => {
        const updatedCash = Number(i.cash.replace(',', '.'));
        return {...i, cash: updatedCash }
      })

      const outcomes = newOutcomes.map(i => {
        const updatedCash = Number(i.cash.replace(',', '.'));
        return {...i, cash: updatedCash }
      })

      const data = await axios.post('approval.json', { incomes, outcomes })
      console.log(data);
      const updatedCode = codes.findIndex(c => c.code === currentCode);
      const newCodes = codes.map((c, index) => {
        if (index === updatedCode) {
          return { ...c, approvalInfo: data.data.name }
        }
        else return { ...c }
      })
      axios.put('codes.json', newCodes)
      store.dispatch(fetchCodes(codes.data))
    }
  };

    return (
      <section className="Section">
      <header>
        <h2>Zatwierdź imprezę finansowo</h2>
        <TextField
          style={{width: '40%', margin: '16px 0'}}
          label="Wybierz imprezę do zatwierdzenia"
          value={currentCode}
          onChange={(e) => setCurrentCode(e.target.value)}
          placeholder="Wybierz kod z listy"
          select={true}
          size="small"
          variant="outlined"
          Smargin="normal"
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
          {newIncomes && newIncomes.map((i, index) => {
            return (
              <div style={{ display: "flex"}}>
              <TextField
                size='medium'
                value={i.cash}
                margin='dense'
                onChange={(e) => editData(newIncomes, index, {cash: e.target.value}, 'income')}
                style={{ maxWidth: "200px", marginRight: "16px" }}
            />
            <TextField
              size='medium'
              value={i.purpose}
              margin='dense'
              onChange={(e) => editData(newIncomes, index, {purpose: e.target.value}, 'income')}
              style={{ width: "600px"}}
            />
            </div>
            )
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        {newOutcomes && newOutcomes.map(i => {
            return (
              <div style={{ display: "flex"}}>
                <TextField
              size='medium'
              value={i.cash}
              margin='dense'
              style={{ maxWidth: "200px", marginRight: "16px" }}
            />
            <TextField
            size='medium'
            value={i.purpose}
            margin='dense'
            style={{ width: "600px"}}
          />
          </div>
            )
          })}
          </div>
        </ul>
        <Tooltip title="Dodaj wydatek" aria-label="add-team">
          <IconButton><AddIcon onClick={() => createOutcome()}/></IconButton>
      </Tooltip>
        </section>
      </main>
      <Button variant="contained" color="primary" onClick={() => sendApproval()}>Zapisz zatwierdzenie</Button>
      </section>
    );
}

export default EventApproval;
