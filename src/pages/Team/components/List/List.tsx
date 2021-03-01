import React from 'react';

import { IncomeDb } from 'models/income.models';
import './style.css';

export const List = ({ rows }: {rows: IncomeDb[]}) => {
  return (
    <div className="containerList">
      <ul className="ul">
        {rows.map((el: IncomeDb, index: number) => {
          return (
            <li key={index} className="li">
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