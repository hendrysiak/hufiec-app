import React from "react";

import classes from "./Navigation.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";

const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/" exact>
      IMPORT PRZELEWÓW
    </NavigationItem>
    <NavigationItem link="/imported">PRZELEWY ZAIMPORTOWANE</NavigationItem>
    <NavigationItem link="/non-assigned">PRZELEWY NIEPRZYPISANE</NavigationItem>
    <NavigationItem link="/codes">FILTRUJ PO KODZIE</NavigationItem>
    <NavigationItem link="/teams">FILTRUJ PO DRUŻYNIE</NavigationItem>
    <NavigationItem link="/add-code">DODAJ KOD</NavigationItem>
    <NavigationItem link="/add-summary">DODAJ ROZLICZENIE</NavigationItem>
    <NavigationItem link="/show-base">POKAŻ BAZĘ</NavigationItem>
  </ul>
);

export default navigationItems;
