import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DataGrid, useScrollFn, RowModel } from '@material-ui/data-grid';
import React, {useEffect, useState} from 'react';

import './style.css';
import axios from 'axios-income';


interface IMember {
  id: number | string;
  lp: number | string;
  name: string;
  surname: string;
  cash: number;
  event: string;
  importDate: string;
  team: string;
  title: string;
  year: number;
}
interface Props {
  icon: string;
  // payments: IMember[],
  incomes: number;
}

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});

const TeamFinanses = ({ incomes, icon } : Props): JSX.Element => {

  
  const classes = useStyles();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  // const [rows, setRows] = useState<IMember[] | []>([]);
  // const columns = [
  //   { field: 'lp', headerName: 'LP', width: 80 },
  //   { field: 'name', headerName: 'IMIĘ', width: 150 },
  //   { field: 'surname', headerName: 'NAZWISKO', width: 150 },
  //   { field: 'cash', headerName: 'KWOTA', width: 150 },
  //   { field: 'title', headerName: 'TYTUŁ', width: 350 },
  //   { field: 'importDate', headerName: 'DATA', width: 150 },
  // ];

  function createData(name: string, estate: number, expenses: number) {
    return { name, estate, expenses};
  }

  const onePercent = 40.72;

  const rows = [
    createData('1%', onePercent, 99999999999999),
    createData('SKŁADKI', (incomes / 5), 999999999999999),
  ];

  const [test ,setTest] = useState<any>();

  useEffect(() => {
    const getData = async () => {
      const result = await axios.get(`/onePercent/${'12427'}.json`);
      setTest(result.data);
    };
    getData();
  });

  const sum = incomes / 5 + onePercent;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // useEffect(() => {
  //   const helper: IMember[] = payments ? (payments.map((el: IMember, index: number) => {
  //     return ({
  //       ...el,
  //       lp: index + 1,
  //       id: index,
  //     });
  //   })) : ([]);
  //   // setRows(helper);
  // },[payments]);

  return (
    <>
      <button type="button" onClick={handleOpen}>
        {icon}
      </button>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          {/* <h1>Drużyna</h1>
          <div style={{ width: 1500 }}>
            {true ? (
              // <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection autoHeight={true}/>
              <DataGrid
                columns={[{ field: '' }]}
                rows={
                  [
                    { id: 1, name: 'React' },
                    { id: 2, name: 'Material-UI' },
                  ] as RowModel[]
                }
                autoHeight={true}
              />
            ) : (
              <div className="loadingInfo">wczytywanie płatności drużyny</div>
            )
            }
          </div> */}
          <section className="tableFinanses">
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>KONTO</TableCell>
                    <TableCell align="right">STAN</TableCell>
                    <TableCell align="right">PRZYSZŁE WYDATKI</TableCell>
                    {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.estate}</TableCell>
                      <TableCell align="right">{row.expenses}</TableCell>
                      {/* <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell> */}
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

export default TeamFinanses;