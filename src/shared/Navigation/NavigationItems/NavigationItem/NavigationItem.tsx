import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.css';

type Props = {
  link: string;
  exact: boolean;
  children: JSX.Element;
}

const NavigationItem = (props: Props): JSX.Element => (
  <li className={classes.NavigationItem}>
    <NavLink
      to={props.link}
      exact={props.exact}
      activeClassName={classes.active}
    >
      {props.children}
    </NavLink>
  </li>
);

export default NavigationItem;