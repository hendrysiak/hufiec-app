import React from "react";

import classes from "./Navigation.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const navigationItems = props => (
  <ul
    className={
      props.navigation === "main"
        ? classes.NavigationItems
        : classes.NavigationItemsHeader
    }
  >
    {props.list.map((item, index) => (
      <NavigationItem key={index} link={item.link}>
        {item.title}
      </NavigationItem>
    ))}
  </ul>
);

export default navigationItems;
