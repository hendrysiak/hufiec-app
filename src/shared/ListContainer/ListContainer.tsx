import React from 'react';

import classes from './ListContainer.module.css';

type Props = {
  title?: string;
  //TODO Fix type or delete component
  children: any;
}

const ListContainer = (props: Props): JSX.Element => (
  <ul className={classes.List}>
    {props.title && <h3>{props.title}</h3>}
    {props.children}
  </ul>
);

export default ListContainer;
