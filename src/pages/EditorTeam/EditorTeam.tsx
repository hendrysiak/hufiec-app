import { MenuItem, TablePagination, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import EditIcon from '@material-ui/icons/EditOutlined';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React, { useState, useEffect, FC } from 'react';

import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';

import { useDebounce } from 'helpers/hooks/useDebounce';
import { sortOfSurname } from 'helpers/sorting.helper';
import { Rows } from 'models/global.enum';
import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'pages/Team/helpers/member-fee.helper';
import { LogOut } from 'shared/LogOut/LogOut';
import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import { deleteTeamMember, editTeamMember, permanentDeleteTeamMember } from '../../helpers/editing-db.handler';

import SelectTeam from './components/SelectTeam';
import { Filter } from './Filter';
import { CustomTableCell } from './functions/newCell';
import { useStyles } from './stylesTable';

export interface IPerson extends APIPerson {
  lp?: number;
  isEditMode?: boolean;
  // team: number | null;
}

interface DataToExport extends IPerson {
  team: string
}

const EditorTeam: FC = () => {
  // const registry = useSelector((state: RootState) => state.income.registry);
  // const [rows, setRows] = useState<IPerson[]>([]);
  // const [dataToExport, setDataToExport] = useState<DataToExport[]>([]);
  // const [team, setTeam] = useState<string>('');
  // const classes = useStyles();
  // const [actualValue, setActualValue] = useState<IPerson>(
  //   { name: '', surname:'', id: '', dateOfAdd: null }
  // );
  // const [prevValue, setPrevValue] = useState<IPerson>(
  //   { name: '', surname: '', id: '', dateOfAdd: null, dateOfDelete: null }
  // );
  // // const [activeEdit, setActiveEdit] = useState<boolean>(false);
  // const [activeRow, setActiveRow] = useState<string | null>(null);
  // const [activeLp, setActiveLp] = useState<string | number | null>(null);

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(25);

  // const [name, setName] = useState<string>('');
  // const [surname, setSurname] = useState<string>('');

  // const [newTeam, setNewTeam] = useState<string | null>(null);


  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };
    
  // const handleAcceptChange = (id: string) => {
  //   const asyncEditTeamMember = async (team: string, person: APIPerson, newTeam: string | null = null) => {
  //     try {
  //       await editTeamMember(team, person, newTeam);
  //     }

  //     catch (err) {
  //       console.error(err);
  //     }
  //   };
    
  //   setActualValue(prev => {
  //     return {
  //       ...prev,
  //       dateOfDelete: null
  //     };
  //   });
  //   setActiveRow(null);
  //   setActiveLp(null);
  //   rows && rows.map(el => {
  //     if (el.id === id && (prevValue.name !== actualValue.name 
  //       || prevValue.surname !== actualValue.surname 
  //       || prevValue.dateOfAdd !== actualValue.dateOfAdd 
  //       || prevValue.dateOfDelete !== actualValue.dateOfDelete
  //       || prevValue.team !== actualValue.team)) {

  //       asyncEditTeamMember(team,
  //         { id: actualValue.id,
  //           name: actualValue.name,
  //           surname: actualValue.surname,
  //           dateOfAdd: actualValue.dateOfAdd,
  //           dateOfDelete: actualValue.dateOfDelete && Date.parse(`${actualValue.dateOfDelete}`) ? actualValue.dateOfDelete : null },
  //         newTeam);
  //       setPrevValue((prev) => (
  //         {
  //           ...prev,
  //           name: actualValue.name,
  //           surname: actualValue.surname,
  //           dateOfAdd: actualValue.dateOfAdd,
  //           dateOfDelete: actualValue.dateOfDelete,
  //         }
  //       ));
  //     }
  //     return el;
  //   });
  //   onToggleEditMode(id);
  // };

  // const onToggleEditMode = (id: string) => {
  //   if (activeRow && rows && prevValue.id !== id) {
  //     alert(`Jesteś w trakcie edycji innej osoby.`);
  //     return;
  //   };
  //   !activeRow && setActiveRow(id);
  //   !activeRow && setActiveLp(id);
  //   // setActiveEdit(!activeEdit);
  //   rows && rows.find(el => {
  //     if (el.id === id) {
  //       setActualValue(el);
  //     };
  //   });
  //   rows && setRows(() => {
  //     return rows.map((row) => { 
  //       if (row.id === id) {
  //         setPrevValue({ ...row, team: team, dateOfDelete: row.dateOfDelete ? row.dateOfDelete : null });
  //         // return { ...row, isEditMode: !row.isEditMode };
  //       }
  //       return row;
  //     });
  //   });
  // };

  // const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, row: IPerson) => {
  //   if (e.target.name !== Rows.Team && e.target.getAttribute(Rows.Name) === Rows.Lp) return;
  //   const value = e.target.value;
  //   const name = e.target.name;
  //   const { id } = row;

  //   if (name === Rows.Team) setNewTeam(value);
  //   if (rows) {
  //     const newRows = rows.map(row => {
  //       if (row.id === id) {
  //         setActualValue((prev: IPerson) => {
  //           return { ...prev, [name]: value };
  //         });
  //         return { ...row, [name]: value };
  //       }
  //       return row;
  //     });
  //     setRows(newRows);
  //   }
  // };

  // const onRevert = (id: string) => {
  //   if (!window.confirm('jesteś pewien, że chcesz cofnąć zmiany?')) return;
  //   setActiveRow(null);
  //   setActiveLp(null);
  //   // setActiveEdit(false);
    
  //   if (rows) { // if
  //     const newRows = rows.map((row ) => {
  //       if (row.id === id) {
  //         setActualValue(prevValue);
  //         return {
  //           ...row,
  //           ...prevValue,
  //           isEditMode: false,
  //         };
  //       }
  //       return row;
  //     });
  //     setRows(newRows);
  //   }
  // };

  // const handleDelete = async (id: string) => {
  //   if (rows) {
  //     const memberToDelete = rows.filter((el: IPerson) => el.id === id)[0];
  //     if (activeRow !== memberToDelete.id) return alert('Wejdź w tryb edycji');
  //     if (!window.confirm(`Jesteś pewien, że chcesz usunąć osobę: ${memberToDelete.name} ${memberToDelete.surname}`)) return;

  //     memberToDelete.dateOfDelete = new Date();
  //     if (memberToDelete.feeState && memberToDelete.feeState < 0) {
  //       deleteTeamMember(memberToDelete);
  //     } 
  //     else {
  //       try {
  //         await permanentDeleteTeamMember(memberToDelete);
  //         // setActiveEdit(false);
  //         setActiveRow(null);
  //         setActiveLp(null);
  //       }
  //       catch {
  //         alert('Błąd, nie udało się usunąć');
  //       }
  //     };

  //     setActualValue(prev => {
  //       return {
  //         ...prev,
  //         dateOfDelete: memberToDelete.dateOfDelete,
  //       };
  //     });
      
  //   };
  // };

  // const handleChangeSelect = (value: string) => {
  //   setTeam(value);
  // };

  // useEffect(() => {
  //   let usedRegistry: APIPerson[] = [];

  //   if (team === 'Cały hufiec') {

  //     for (const currentTeam in registry) {
  //       console.log({...Object.values(registry[currentTeam])});
  //       usedRegistry = [...usedRegistry, ...Object.values(registry[currentTeam])];
  //     }

  //   } else usedRegistry = registry[team] ? [...Object.values(registry[team])] : [];


  //   if (usedRegistry) {
  //     sortOfSurname(usedRegistry, 'ŻŻŻ');
  //   }
  //   console.log(usedRegistry);
  //   const rows = usedRegistry ? (
  //     usedRegistry
  //       .filter(member => 
  //         member.name?.toLocaleLowerCase().includes(name.toLocaleLowerCase()) && 
  //         member.surname?.toLocaleLowerCase().includes(surname.toLocaleLowerCase()))
  //       .map((member, index) => {
  //         console.log(member);
  //         return (
  //           {
  //             lp: index + 1,
  //             ...member,
  //             feeState: countingMemberFee(member)
  //           }
  //         );
  //       })) : ([]);
  //   setRows(rows);

  //   // let usedData: DataToExport[] = []; 
  //   // if (registry) {
  //   //   if (team === 'Cały hufiec') {
  //   //     usedData = Object.entries(registry)
  //   //       .map(([key, value]: [string, Record<string, APIPerson>]) => value ? [...Object.values(value).map((p: APIPerson) => {
  //   //         return { ...p, team: key, feeState: countingMemberFee(p) };
  //   //       })] : []).flat();
  //   //   } else {
  //   //     usedData = registry[team] ? Object.values(registry[team]).map(p => {
  //   //       return { ...p, team, feeState: countingMemberFee(p) };
  //   //     }) : [];
  //   //   }
  //   // }

  //   // setDataToExport(rows);
  // },[team, registry]);


  // const handleDateChange = (e: Date | null, row: IPerson, nameKey: string) => {
  //   const name = nameKey;
  //   let value = e;
  //   const valueDate = e && Date.parse(`${e}`) ? actualValue.dateOfDelete : null;
  //   if (valueDate && nameKey === 'dateOfAdd') {
  //     if (new Date(`${prevValue.dateOfDelete}`).getTime() - new Date(`${e}`).getTime() > 0) {
  //       value = e;
  //     } else value = prevValue.dateOfAdd;
  //   }
  //   if (valueDate && nameKey === 'dateOfDelete') {
  //     if (new Date(`${e}`).getTime() - new Date(`${prevValue.dateOfAdd}`).getTime() > 0) {
  //       value = e;
  //     } else value = prevValue.dateOfDelete ? prevValue.dateOfDelete : null;
  //   }
  //   const { id } = row;
  //   if (rows) {
  //     const newRows = rows.map(row => {
  //       if (row.id === id) {
  //         setActualValue((prev: IPerson) => {
  //           return { ...prev, [name]: value };
  //         });
  //         return { ...row, [name]: value };
  //       }
  //       return row;
  //     });
  //     setRows(newRows);
  //   }

  // };

  return ( <></>
    // <>
    //   <LogOut />
    //   <Navigation />
    //   <SelectTeam onChange={handleChangeSelect} team={team}/>
    //   <CSVLink data={rows} filename={`${team}.csv`}>
    //     <Button variant="contained" color="primary" >Pobierz stan składek</Button>
    //   </CSVLink>
    //   <Table className={classes.table} aria-label="caption table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell align="left">Edytuj</TableCell>
    //         <TableCell align="left">LP</TableCell>
    //         <TableCell align="left">Nazwisko</TableCell>
    //         <TableCell align="left">Imię</TableCell>
    //         <TableCell align="left">Data dodania</TableCell>
    //         <TableCell align="left">Data usunięcia</TableCell>
    //         <TableCell align="left">Stan składek</TableCell>
    //         <TableCell align="left"></TableCell>
    //         <TableCell align="left">Usuń</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {rows && rows
    //         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    //         .map((row: IPerson) => (
    //           <TableRow key={row.id}>
    //             <TableCell className={classes.selectTableCell}>
    //               {console.log(row, activeLp, row.lp )}
    //               {row.lp === activeLp ? (
    //                 <>
    //                   <IconButton
    //                     aria-label="done"
    //                     onClick={() => handleAcceptChange(row.id)}
    //                   >
    //                     <DoneIcon />
    //                   </IconButton>
    //                   <IconButton
    //                     aria-label="revert"
    //                     onClick={() => onRevert(row.id)}
    //                   >
    //                     <RevertIcon />
    //                   </IconButton>
    //                 </>
    //               ) : (
    //                 <IconButton
    //                   aria-label="delete"
    //                   onClick={() => onToggleEditMode(row.id)}
    //                 >
    //                   <EditIcon />
    //                 </IconButton>
    //               )}
    //             </TableCell>
    //             {/* <CustomTableCell {...{ row, name: Rows.Lp, onChange , lp: activeLp }} />
    //             <CustomTableCell {...{ row, name: Rows.Surname, onChange, lp: activeLp }} />
    //             <CustomTableCell {...{ row, name: Rows.Name, onChange, lp: activeLp }} /> */}
    //             {/* <CustomTableCell {...{ row, name: 'dateOfAdd', onChange }} /> */}
    //             <TableCell >
    //               <KeyboardDatePicker
    //                 disabled={activeRow !== row.id}
    //                 disableToolbar
    //                 variant="inline"
    //                 key={row.id}
    //                 margin="normal"
    //                 id="date-picker-dialog"
    //                 // label="Data dodania"
    //                 format="dd/MM/yyyy"
    //                 value={row.dateOfAdd ? new Date(row.dateOfAdd) : null}
    //                 onChange={(e) => handleDateChange(e, row, 'dateOfAdd')}
    //                 KeyboardButtonProps={{
    //                   'aria-label': 'change date'
    //                 }}
    //               />
    //             </TableCell>
    //             <TableCell>
    //               <KeyboardDatePicker
    //                 disabled={activeRow !== row.id}
    //                 disableToolbar
    //                 variant="inline"
    //                 key={row.id}
    //                 margin="normal"
    //                 id="date-picker-dialog"
    //                 // label="Data usunięcia"
    //                 format="dd/MM/yyyy"
    //                 value={row.dateOfDelete ? new Date(row.dateOfDelete) : null}
    //                 onChange={(e) => handleDateChange(e, row, 'dateOfDelete')}
    //                 KeyboardButtonProps={{
    //                   'aria-label': 'change date'
    //                 }}
    //               /></TableCell>
    //             <TableCell>{row.feeState}</TableCell>
    //             {row.id === activeRow ? 
    //               <TableCell>
    //                 <TextField
    //                   name={Rows.Team}
    //                   id="standard-select-currency"
    //                   select
    //                   label="Wybierz"
    //                   value={newTeam}
    //                   onChange={(e) => onChange(e, row)}
    //                   helperText="Przenieś do innej drużyny"
    //                 >
    //                   {Object.keys(registry).slice(0,-1).map((option) => (
    //                     <MenuItem key={option} value={option}>
    //                       {option}
    //                     </MenuItem>
    //                   ))}
    //                 </TextField>
    //               </TableCell> : <TableCell></TableCell>}
    //             <TableCell className={classes.selectTableCell}>
    //               <IconButton
    //                 aria-label="delete"
    //                 onClick={() => handleDelete(row.id)}
    //               >
    //                 <DeleteIcon />
    //               </IconButton>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //     </TableBody>
    //   </Table>
    //   <TablePagination
    //     rowsPerPageOptions={[25, 50, 100]}
    //     component="div"
    //     count={rows.length}
    //     rowsPerPage={rowsPerPage}
    //     page={page}
    //     onChangePage={handleChangePage}
    //     onChangeRowsPerPage={handleChangeRowsPerPage}
    //     labelRowsPerPage="Ilośc wierszy na stronie"
    //   />
    // </>
  );
};

export default EditorTeam;
