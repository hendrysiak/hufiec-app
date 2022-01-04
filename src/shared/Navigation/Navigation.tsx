
import AddBoxIcon from '@material-ui/icons/AddBox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
import CodeIcon from '@material-ui/icons/Code';
import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';

import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import TableChartIcon from '@material-ui/icons/TableChart';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import React, { useEffect } from 'react';


import NavigationItem from './NavigationItems/NavigationItem/NavigationItem';

const Navigation = (): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  useEffect(() => {
    document.body.addEventListener('click', (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (target 
        && !(target.classList.contains('nav__open') || target.classList.contains('nav__open--icon'))
      ) setIsOpen(false);
    });    
  },[]);

  const navigation = [
    { link: '/', title: 'STRONA GŁÓWNA', icon: <TableChartIcon fontSize="small" /> },
    { link: '/proposals', title: 'AKCJE DO PODJĘCIA', icon: <FactCheckIcon fontSize="small" /> },
    { link: '/transfers', title: 'PRZELEWY - OBSŁUGA', icon: <AttachMoneyIcon fontSize="small" /> },
    { link: '/codes', title: 'FILTRUJ PO KODZIE', icon: <CodeIcon fontSize="small" /> },
    { link: '/add-code', title: 'KODY', icon: <AddBoxIcon fontSize="small" /> },
    // { link: '/add-approval', title: 'DODAJ ZATWIERDZENIE', icon: <PlaylistAddIcon fontSize="small" /> },
    // { link: '/add-billing', title: 'DODAJ ROZLICZENIE', icon: <PlaylistAddCheckIcon fontSize="small" /> },
    { link: '/editor', title: 'EDYTUJ PRZYCHODY/KOSZTY', icon: <EditIcon fontSize="small" /> },
    { link: '/editor-team', title: 'EDYTUJ DRUŻYNĘ', icon: <EditIcon fontSize="small" /> },
    { link: '/addpercent', title: 'DODAJ 1%', icon: <EditIcon fontSize="small" /> },
    { link: '/users', title: 'ZARZĄDZAJ ROLAMI', icon: <PeopleAltIcon fontSize="small" /> },
  ];

  return (
    <>
      <div className={`nav ${isOpen ? 'nav--active' : ''}`}>
        <div className="nav__open" onClick={(): void => setIsOpen(!isOpen)}>
          {isOpen ? <CloseIcon/> : <LaunchIcon className="nav__open--icon" />}
        </div>
        {navigation.map((nEl, index: number) => (
          <NavigationItem 
            key={index}
            link={nEl.link}
            exact
          >
            <>{nEl.icon}<span>{`${nEl.title}`}</span></>
          </NavigationItem>))}
      </div>

    </>
  );

};

export default Navigation;
