import React from "react";

import classes from "./Navigation.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import { NavLink } from "react-router-dom";

import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Link from '@material-ui/core/Link';

const Navigation = props => (
  <Paper className={classes.root}>
  <Menu
    anchorEl={props.anchorEl}
    keepMounted
    open={props.open}
    onClose={props.handleClose}
  >
<MenuList>
  {props.list && props.list.map((item, index) => (
        <Link
          key={index}
          href={item.link}
          exact
        >
        <MenuItem>
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <Typography variant="inherit">{item.title}</Typography>
        </MenuItem>
          </Link>
      )) }
</MenuList>
</Menu>
</Paper>
);

export default Navigation;
