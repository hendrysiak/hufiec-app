import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import React, { useEffect } from 'react';

import axios from 'axios-income';

import { FoundingSources } from 'models/global.enum';
import { IncomeDb, OutcomeDb } from 'models/income.models';

import classes from './TeamFinances.module.css';


interface Props {
  incomes: IncomeDb[];
  outcomes: OutcomeDb[];
  currentTeam: string;
}

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});

const TeamFinances = ({ incomes, outcomes, currentTeam } : Props): JSX.Element => {

  const [onePercent, setOnePercent] = React.useState<number>(0);
  const classe = useStyles();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [incomesSC, setIncomesSC] = React.useState<number | null>(null);

  const createData = (
    name: string, 
    estate: number, 
    // expenses: number
  ) => {
    // return { name, estate, expenses };
    return { name, estate };
  };
   
  const rows = [
    createData('1%', onePercent),
    createData('SKŁADKI', (incomesSC ? incomesSC / 5 : 0)),
    createData('ZAKUPY/FAKTURY/POTRĄCENIA', outcomes.filter(o => o.foundingSource === FoundingSources.TeamAccount).reduce((sum: number, outcome) => sum + outcome.cash , 0)),
    createData('WPŁYWY/WYRÓWNANIA', incomes.reduce((sum: number, income) => sum + income.cash , 0)),
  ];

  useEffect(() => {
    const getData = async () => {
      const result = await axios.get(`/onePercent/${currentTeam}.json`);
      setOnePercent(result.data);
    };
    getData();
    const sum = incomes && incomes
      .filter(income => income.event === 'SC')
      .reduce((sum: number, income) => sum + income.cash ,0); 
    
    setIncomesSC(sum);
  });

  const sum = (incomesSC ? incomesSC / 5 : 0) + onePercent;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <AttachMoneyIcon onClick={handleOpen} />
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <section className={classes.positionModal }>
            <TableContainer component={Paper}>
              <Table className={classe.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>KONTO</TableCell>
                    <TableCell align="right">STAN</TableCell>
                    {/* <TableCell align="right">PRZYSZŁE WYDATKI</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.estate}</TableCell>
                      {/* <TableCell align="right">{row.expenses}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <h1 className="sum">RAZEM: {sum} zł</h1>
          </section>
        </>
      </Modal>
    </>
  );
};

export default TeamFinances;