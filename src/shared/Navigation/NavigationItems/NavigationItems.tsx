import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';


import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DraftsIcon from '@material-ui/icons/Drafts';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import SendIcon from '@material-ui/icons/Send';
import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './Navigation.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const Navigation = (): JSX.Element => (<></>
  // <Paper className={classes.root}>
  //   <Menu
  //     anchorEl={props.anchorEl}
  //     keepMounted
  //     open={props.open}
  //     onClose={props.handleClose}
  //   >
  //     <MenuList>
  //       {props.list && props.list.map((item, index) => (
  //         <Link
  //           key={index}
  //           href={item.link}
  //           exact
  //         >
  //           <MenuItem>
  //             <ListItemIcon>
  //               {item.icon}
  //             </ListItemIcon>
  //             <Typography variant="inherit">{item.title}</Typography>
  //           </MenuItem>
  //         </Link>
  //       )) }
  //     </MenuList>
  //   </Menu>
  // </Paper>
);

export default Navigation;
