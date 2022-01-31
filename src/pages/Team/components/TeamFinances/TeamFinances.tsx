import Modal from '@material-ui/core/Modal';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
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
}


const TeamFinances = ({ incomes, outcomes, currentTeam } : Props): JSX.Element => {

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
    const sumOfFees = incomes && incomes
      .filter(income => income.event === 'SC')
      .reduce((sum: number, income) => sum + income.cash ,0); 

    const sumOfCompensation = incomes.filter(i => i.event === 'KOMP').reduce((sum: number, income) => sum + Number(income.cash) , 0);
    const sumOfOutcomes = outcomes.filter(o => o.foundingSource === FoundingSources.TeamAccount).reduce((sum: number, outcome) => sum + Number(outcome.cash) , 0);
    
    setSumOfOutcomes(sumOfOutcomes);
    setCompensation(sumOfCompensation);
    setIncomesSC(sumOfFees);

  });

  const sum = (incomesSC ? incomesSC / 5 : 0) + onePercent + sumOfOutcomes + compensation;

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
      <section className={classes.positionModal }>
        <div className={classes.header}>
          <p>Konto</p>
          <p>Stan</p>
        </div>
        <div className={classes.item}>
          <p>1%</p>
          <p>{onePercent}</p>
        </div>
        <div className={classes.item}>
          <p>SKŁADKI</p>
          <p>{(incomesSC ? incomesSC / 5 : 0)}</p>
        </div>
        <div className={classes.item}>
          <p>ZAKUPY/FAKTURY/POTRĄCENIA</p>
          <p>{sumOfOutcomes}</p>
        </div>
        <div className={classes.item}>
          <p>WPŁYWY/WYRÓWNANIA</p>
          <p>{compensation}</p>
        </div>
        <h1 className={classes.sum}>RAZEM: {sum} zł</h1>
      </section>
      {/* </Modal> */}
    </>
  );
};

export default TeamFinances;