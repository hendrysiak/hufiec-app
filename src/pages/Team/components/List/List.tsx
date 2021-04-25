import { FormControl, MenuItem, Select } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React, { useEffect, useRef, useState } from 'react';

import { IncomeDb } from 'models/income.models';

import './style.css';

enum ActionPagination {
  Next = 'next',
  Prev = 'prev'
}

export const List = ({ navHeight, scrollPosition, rows }: 
{navHeight: number | null, scrollPosition: number, rows: IncomeDb[]}): JSX.Element => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [displayRows, setDisplayRows] = useState<IncomeDb[]>(rows);
  const [barFixed, serBarFixed] = useState<boolean>(false);
  const [heightFirstLi, setHeightFirstLi] = useState<number>(0);

  const handleRowsPerPage = (value: string) => { 
    setRowsPerPage(Number(value));

    if ((page * rowsPerPage) > displayRows.length) {
      setPage(0);
    }

  };

  useEffect(() => {
    if (navHeight && navHeight < scrollPosition) {
      if (firstLi?.current?.clientHeight) {
        setHeightFirstLi(firstLi?.current?.clientHeight);
      }
      serBarFixed(true);
    } else {
      setHeightFirstLi(0);
      serBarFixed(false);
    };
  },[scrollPosition]);

  useEffect(() => {
    const min = page * rowsPerPage;
    const max = min + rowsPerPage;
    const copyRows = [...rows].slice(min,max);
    setDisplayRows(copyRows);
  },[rowsPerPage, page, rows]);
  
  useEffect(() => {
    window.scrollTo(0,0);
  },[page]);

  const handleChangePage = (action: string) => {
    
    if (action === ActionPagination.Next && rows.length > page * rowsPerPage + rowsPerPage) {
      setPage(prev => prev + 1);
    }
    if (action === ActionPagination.Prev && page > 0) {
      setPage(prev => prev - 1);
    }
  };

  const firstLi = useRef<HTMLLIElement>(null);

  const controlEntireDataRow = (el: IncomeDb) => {
    if (el.name && el.surname && el.dateOfBook && el.title && el.event && el.cash) {
      return true;
    }
    return false;
  };

  return (
    <div className="containerList">
      <ul className="ul">
        <li ref={firstLi} className={`first ${barFixed ? 'fixedBar' : ''}`}>
          <div className="containerGroup">
            <p className="name">NAZWISKO I IMIĘ</p>
            <p className="date">DATA</p>
            <p className="title">TYTUŁ</p>
          </div>
          <p className="event">KOD</p>
          <p className="cash">KWOTA</p>
        </li>
        {displayRows.map((el: IncomeDb, index: number) => {
          return (
            <li 
              key={index} 
              style={{ marginTop: `${index === 0 && barFixed ? heightFirstLi + 'px' : '0'}` }} 
              className={`li ${controlEntireDataRow(el) ? '' : 'incompleteData'}`}>
              <div className="containerGroup">
                <p className="name">{el.surname} {el.name}</p>
                <p className="date">{el.dateOfBook} </p>
                <p className="title">{el.title}</p>
              </div>
              <p className="event">{el.event}</p>
              <p className="cash">{el.cash}</p>
            </li>
          );
        })}
        <li className="li paginationContainer">
          <div className="paginationItem">
            <p className="textRowPag">Ilość wierszy na stronie:</p> 
            <FormControl>
              <Select
                value={rowsPerPage}
                onChange={(e: React.ChangeEvent<{ value: unknown }>): void => handleRowsPerPage(e.target.value as string)}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="paginationItem">
            od {page * rowsPerPage + 1} do {page * rowsPerPage + rowsPerPage < rows.length ? 
              page * rowsPerPage + rowsPerPage : rows.length } of {rows.length}
          </div>
          <div className="paginationItem">
            <ChevronLeftIcon onClick={() => handleChangePage(ActionPagination.Prev)} style={{ cursor: 'pointer', fontSize: '44px' }}/> 
            <ChevronRightIcon onClick={() => handleChangePage(ActionPagination.Next)} style={{ cursor: 'pointer', fontSize: '44px' }}/>
          </div>
        </li>
      </ul>
    </div>
  );
};