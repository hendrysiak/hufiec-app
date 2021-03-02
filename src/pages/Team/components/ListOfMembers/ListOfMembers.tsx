import React from 'react';
import classes from './style.module.css';
export const ListOfMembers = ({rows}: any) => {
  return (
    // <div></div>
    <div className={classes.containerListMembers}>
      <div className={`${classes.first} ${classes.li}`}>
{/*      <div className="containerGroup"> */}
        <p className={classes.id}>ID</p>
        <p className={classes.name}>IMIĘ I NAZWISKO</p>
        <p className={classes.cash}>STAN SKŁADEK</p>
{/*      </div> */}
        <p className={classes.deleted}>Usunięty/-a?</p>
      </div>
      <ul className={classes.ul}>
        {rows.map((el: any, index: number) => {
          return (
            <li key={index} className={`${classes.li} ${el.name ? '' : 'incompleteData'}`}>
              {/* <div className="containerGroup"> */}
              <p className={classes.id}>{el.lp}</p>
              <p className={classes.name}>{el.name} {el.surname}</p>
              {/* </div> */}
              <p className={classes.cash}>{el.fee}</p>
              <p className={classes.deleted}>{el.isDeleted}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}