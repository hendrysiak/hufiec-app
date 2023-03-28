import React, { useEffect } from 'react';

import axios from 'axios-income';

import { FoundingSources } from 'models/global.enum';
import { IncomeDb, OutcomeDb } from 'models/income.models';

import { IViewModal } from 'models/viewModal.models';

import { ShowModal } from '../../helpers/typeViewModal.enum';

import classes from './TeamFinances.module.css';

interface Props {
  // open: IViewModal;
  incomes: IncomeDb[];
  outcomes: OutcomeDb[];
  currentTeam: string;
  neededFee: number;
}

const percentOfFeesForTeam = {
  2023: 0.2,
  2022: 0.16
}

function TeamFinances({
  incomes, outcomes, currentTeam, neededFee,
} : Props): JSX.Element {
  const [onePercent, setOnePercent] = React.useState<number>(0);
  const [compensation, setCompensation] = React.useState<number>(0);
  const [sumOfOutcomes, setSumOfOutcomes] = React.useState<number>(0);

  // const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [incomesSC, setIncomesSC] = React.useState<number | null>(null);

  // useEffect(() => {
  //   open === ShowModal.Finances && setIsOpen(true);
  // },[open]);

  useEffect(() => {
    const getData = async () => {
      const result = await axios.get(`/onePercent/${currentTeam}.json`);
      setOnePercent(result.data);
    };
    getData();
    const currentYear = new Date().getFullYear();
    const sumOfFees = incomes && incomes
      .filter((income) => income.event === 'SC' && income.year === currentYear - 1)
      .reduce((sum: number, income) => sum + income.cash, 0);

    const sumOfFeesForTeam = incomes && incomes
      .filter((income) => income.event === 'SC')
      .reduce((sum: number, income) => {
        if (income.year === 2023) {
          return sum + income.cash * 0.2
        } else return sum + income.cash * 0.16
      }, 0);

    const sumOfCompensation = incomes.filter((i) => i.event === 'KOMP').reduce((sum: number, income) => sum + Number(income.cash), 0);
    const sumOfOutcomes = outcomes.filter((o) => o.foundingSource === FoundingSources.TeamAccount).reduce((sum: number, outcome) => sum + Number(outcome.cash), 0);

    setSumOfOutcomes(sumOfOutcomes);
    setCompensation(sumOfCompensation);
    setIncomesSC(sumOfFeesForTeam);
  });

  const sum = (incomesSC ?? 0) + onePercent + sumOfOutcomes + compensation + (neededFee * 0.8);

  // const handleOpen = () => {
  //   setIsOpen(true);
  // };

  // const handleClose = () => {
  //   setIsOpen(false);
  // };

  return (
    <>
      {/* <AttachMoneyIcon onClick={handleOpen}/>
      <Modal
        open={isOpen}
        onClose={handleClose}
      > */}
      <div style={{ height: '94vh' }}>
      <section className={classes.positionModal}>
        <div className={classes.header}>
          <p>Konto</p>
          <p>Stan</p>
        </div>
        <div className={classes.item}>
          <p>STAN KONTA ZA ROK UBIEGŁY (1% + KONTO)</p>
          <p>{onePercent}</p>
        </div>
        <div className={classes.item}>
          <p>SKŁADKI ZEBRANE</p>
          <p>{incomesSC}</p>
        </div>
        <div className={classes.item}>
          <p>SKŁADKI NIEZEBRANE</p>
          <p>{neededFee.toFixed(2)}</p>
        </div>
        <div className={classes.item}>
          <p>SKŁADKI ZOSTAJĄCE W DRUŻYNIE</p>
          <p>{(incomesSC ? incomesSC / 5 : 0).toFixed(2)}</p>
        </div>
        <div className={classes.item}>
          <p>SKŁADKI DO ODJĘCIA</p>
          <p>{(neededFee * 0.8).toFixed(2)}</p>
        </div>
        <div className={classes.item}>
          <p>ZAKUPY/FAKTURY/POTRĄCENIA</p>
          <p>{sumOfOutcomes.toFixed(2)}</p>
        </div>
        <div className={classes.item}>
          <p>WPŁYWY/WYRÓWNANIA</p>
          <p>{compensation.toFixed(2)}</p>
        </div>
        <h1 className={classes.sum}>
          RAZEM:
          {sum.toFixed(2)}
          {' '}
          zł
        </h1>
      </section>
      </div>
      {/* </Modal> */}
    </>
  );
}

export default TeamFinances;
