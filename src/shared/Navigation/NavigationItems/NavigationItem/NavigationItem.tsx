import React from 'react';
import { NavLink } from 'react-router-dom';
import NextLink from 'next/link'

import classes from './NavigationItem.module.css';

type Props = {
  link: string;
  exact: boolean;
  children: React.ReactNode;
};

function NavigationItem(props: Props): JSX.Element {
  return (
    <li className={classes.NavigationItem}>
      <NextLink
        href={props.link}
      >
        {props.children}
      </NextLink>
    </li>
  );
}

export default NavigationItem;
