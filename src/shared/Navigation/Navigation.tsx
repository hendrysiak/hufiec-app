'use client'

import AddBoxIcon from '@mui/icons-material/AddBox';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GroupsIcon from '@mui/icons-material/Groups';
import LaunchIcon from '@mui/icons-material/Launch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import TableChartIcon from '@mui/icons-material/TableChart';

import React, { useEffect } from 'react';

import NavigationItem from './NavigationItems/NavigationItem/NavigationItem';
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation'
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 300;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


function Navigation({ open, handleDrawerClose }: { open?: boolean, handleDrawerClose: () => void }): JSX.Element {
  const theme = useTheme();
  const router = useRouter()

  const navigation = [
    { link: '/dashboard', title: 'STRONA GŁÓWNA', icon: <TableChartIcon fontSize="small" /> },
    { link: '/account', title: 'STANY KONT', icon: <AccountBalanceRoundedIcon fontSize="small" /> },
    { link: '/decisions', title: 'DECYZJE DO PODJĘCIA', icon: <AllInboxIcon fontSize="small" /> },
    { link: '/proposals', title: 'AKCJE DO PODJĘCIA', icon: <FactCheckIcon fontSize="small" /> },
    { link: '/transfers', title: 'PRZELEWY - OBSŁUGA', icon: <AttachMoneyIcon fontSize="small" /> },
    // { link: '/codes', title: 'FILTRUJ PO KODZIE', icon: <CodeIcon fontSize="small" /> },
    { link: '/add-code', title: 'KODY', icon: <AddBoxIcon fontSize="small" /> },
    // { link: '/add-approval', title: 'DODAJ ZATWIERDZENIE', icon: <PlaylistAddIcon fontSize="small" /> },
    // { link: '/add-billing', title: 'DODAJ ROZLICZENIE', icon: <PlaylistAddCheckIcon fontSize="small" /> },
    { link: '/editor', title: 'EDYTUJ PRZYCHODY/KOSZTY', icon: <EditIcon fontSize="small" /> },
    { link: '/editor-team', title: 'EDYTUJ DRUŻYNĘ', icon: <CodeIcon fontSize="small" /> },
    { link: '/users', title: 'ZARZĄDZAJ ROLAMI', icon: <PeopleAltIcon fontSize="small" /> },
    { link: '/teams', title: 'ZARZĄDZAJ DRUŻYNAMI', icon: <GroupsIcon fontSize="small" /> },
  ];

  return (
    // <div className={`nav ${isOpen ? 'nav--active' : ''}`}>
    //   <div className="nav__open" onClick={(): void => setIsOpen(!isOpen)}>
    //     {isOpen ? <CloseIcon /> : <LaunchIcon className="nav__open--icon" />}
    //   </div>
    //   {navigation.map((nEl, index: number) => (
    //     <NavigationItem
    //       key={index}
    //       link={nEl.link}
    //       exact
    //     >
    //       <>
    //         {nEl.icon}
    //         <span>{`${nEl.title}`}</span>
    //       </>
    //     </NavigationItem>
    //   ))}
    // </div>
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navigation.map((item) => (
          <ListItem key={item.link} disablePadding>
            <ListItemButton onClick={() => router.push(item.link)}>
              {/* <NavLink
                to={item.link}
                exact
              > */}
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>

              <ListItemText primary={item.title} />
              {/* </NavLink> */}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Navigation;
