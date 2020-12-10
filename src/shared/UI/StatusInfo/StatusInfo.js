import React from "react";
import classes from "./StatusInfo.module.css";

const StatusInfo = props => {
  return <div className={classes.StatusInfo}>{props.info}</div>;
};

export default StatusInfo;
