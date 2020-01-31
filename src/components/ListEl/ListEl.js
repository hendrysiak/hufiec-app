import React from "react";
import classes from "./ListEl.module.css";

const ListEl = props => {
  const style = { color: `${props.color}` };
  return (
    <li className={classes.List}>
      <p className={classes.Phrase} style={style}>
        {props.cash}
      </p>
      <input
        className={classes.Input}
        value={props.title}
        style={style}
        onChange={props.clicked}
      />
    </li>
  );
};

export default ListEl;
