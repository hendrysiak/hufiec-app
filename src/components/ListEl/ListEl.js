import React from "react";

const ListEl = props => {
  const style = { margin: "0 10px", display: "inline-block" };
  return (
    <li>
      <p style={style}>{props.number + 1}</p>
      <p style={style}>{props.value * 1}</p>
      <p style={style}>{props.title}</p>
    </li>
  );
};

export default ListEl;
