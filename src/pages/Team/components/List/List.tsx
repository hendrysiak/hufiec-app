import React from 'react';

import { IncomeDb } from 'models/income.models';
import './style.css';

export const List = ({ rows }: {rows: IncomeDb[]}) => {
  return (
    <div className="containerList">
      <ul className="ul">
        <li className="first">
          <div className="containerGroup">
            <p className="name">IMIĘ I NAZWISKO</p>
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
                <p className="name">{el.name} {el.surname}</p>
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