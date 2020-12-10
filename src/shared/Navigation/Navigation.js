
import IconButton from '@material-ui/core/IconButton';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import EditIcon from '@material-ui/icons/Edit';
import GroupIcon from '@material-ui/icons/Group';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import TableChartIcon from '@material-ui/icons/TableChart';
import React, { useEffect, useRef } from 'react';

import NavigationItems from './NavigationItems/NavigationItems';

const Navigation = () => {
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);
  // const menu = useRef();

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // useEffect(() => {
  //   document.body.addEventListener('click', (event) => {
  //     if (event.currentTarget !== menu) handleClose();
  //   })
  // },[])

  const navigation = [
    { link: '/', title: 'STRONA GŁÓWNA', icon: <TableChartIcon fontSize="small" /> },
    { link: '/transfers', title: 'PRZELEWY - OBSŁUGA', icon: <AttachMoneyIcon fontSize="small" /> },
    { link: '/codes', title: 'FILTRUJ PO KODZIE', icon: <CodeIcon fontSize="small" /> },
    { link: '/teams', title: 'FILTRUJ PO DRUŻYNIE', icon: <GroupIcon fontSize="small" /> },
    { link: '/add-code', title: 'DODAJ KOD', icon: <AddBoxIcon fontSize="small" /> },
    { link: '/add-approval', title: 'DODAJ ZATWIERDZENIE', icon: <PlaylistAddIcon fontSize="small" /> },
    { link: '/add-billing', title: 'DODAJ ROZLICZENIE', icon: <PlaylistAddCheckIcon fontSize="small" /> },
    { link: '/editor', title: 'EDYTUJ PRZYCHODY/KOSZTY', icon: <EditIcon fontSize="small" /> },
  ];

  return (
    <>
      <div className="nav">
        {/* <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          className="Nav__menu"
  
        >
          <MoreVertIcon />
        </IconButton> */}
      </div>
      {/* <NavigationItems
        list={navigation}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        ref={menu}
      /> */}
    </>
  );

};

export default Navigation;
