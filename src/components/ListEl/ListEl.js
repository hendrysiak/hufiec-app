import React from "react";
import classes from "./ListEl.module.css";

const ListEl = props => {
  return (
    <li className={classes.List} onClick={props.clicked}>
      <p className={classes.Phrase}>{props.cash}</p>
      <p className={classes.Phrase}>{props.title}</p>
    </li>
  );
};

export default ListEl;
