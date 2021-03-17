import React from 'react';

import { IncomeDb } from 'models/income.models';
import './style.css';

export const List = ({ rows }: {rows: IncomeDb[]}): JSX.Element => {
  return (
    <div className="containerList">
      <ul className="ul">
        <li className="first">
          <div className="containerGroup">
            <p className="name">NAZWISKO I IMIĘ</p>
            <p className="date">DATA</p>
            <p className="title">TYTUŁ</p>
          </div>
          <p className="event">KOD</p>
          <p className="cash">KWOTA</p>
        </li>
        {rows.map((el: IncomeDb, index: number) => {
          return (
            <li key={index} className={`li ${el.name && el.surname && el.dateOfBook && el.title && el.event && el.cash ? '' : 'incompleteData'}`}>
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
      </ul>
    </div>
  );
};