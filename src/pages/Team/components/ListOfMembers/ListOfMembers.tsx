import React from 'react';

import { APIPerson } from 'models/registry.models';

import classes from './style.module.css';

interface IRows extends APIPerson {
  lp: string | number;
  fee: number;
  isDeleted: string
}

export const ListOfMembers = ({ rows }: {rows: IRows[]}): JSX.Element => {
  return (
    <div className={classes.containerListMembers}>
      <div className={`${classes.first} ${classes.li}`}>
        <p className={classes.id}>ID</p>
        <p className={classes.name}>Imię i nazwisko</p>
        <p className={classes.cash}>Stan składek</p>
        <p className={classes.deleted}>Usunięty/-a?</p>
      </div>
      <ul className={classes.ul}>
        {rows.map((el, index: number) => {
          return (
            <li key={index} className={classes.li}>
              <p className={classes.id}>{el.lp}</p>
              <p className={classes.name}>{el.name} {el.surname}</p>
              <p className={classes.cash}>{el.fee}</p>
              <p className={classes.deleted}>{el.isDeleted}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};