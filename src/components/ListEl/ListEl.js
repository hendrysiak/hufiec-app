import React from "react";

const ListEl = props => {
  return (
    <li>
      <p>{props.number}</p>
      <p>{props.value}</p>
      <p>{props.title}</p>
    </li>
  );
};

export default ListEl;
