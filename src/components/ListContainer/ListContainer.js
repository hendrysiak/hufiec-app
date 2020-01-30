import React from "react";
import classes from "./ListContainer.module.css";

const ListContainer = props => (
  <ul className={classes.List}>
    <h3>{props.title}</h3>
    {props.children}
  </ul>
);

export default ListContainer;
