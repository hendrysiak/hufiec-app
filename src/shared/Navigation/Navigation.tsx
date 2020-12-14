
import AddBoxIcon from '@material-ui/icons/AddBox';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CloseIcon from '@material-ui/icons/Close';
import CodeIcon from '@material-ui/icons/Code';
import EditIcon from '@material-ui/icons/Edit';
import LaunchIcon from '@material-ui/icons/Launch';

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import TableChartIcon from '@material-ui/icons/TableChart';
import React, { useEffect } from 'react';

import NavigationItem from './NavigationItems/NavigationItem/NavigationItem';

const Navigation = (): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    document.body.addEventListener('click', (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (target && !target.classList.contains('nav')) setIsOpen(false);
    });
  },[]);

  const navigation = [
    { link: '/', title: 'STRONA GŁÓWNA', icon: <TableChartIcon fontSize="small" /> },
    { link: '/transfers', title: 'PRZELEWY - OBSŁUGA', icon: <AttachMoneyIcon fontSize="small" /> },
    { link: '/codes', title: 'FILTRUJ PO KODZIE', icon: <CodeIcon fontSize="small" /> },
    { link: '/add-code', title: 'DODAJ KOD', icon: <AddBoxIcon fontSize="small" /> },
    { link: '/add-approval', title: 'DODAJ ZATWIERDZENIE', icon: <PlaylistAddIcon fontSize="small" /> },
    { link: '/add-billing', title: 'DODAJ ROZLICZENIE', icon: <PlaylistAddCheckIcon fontSize="small" /> },
    { link: '/editor', title: 'EDYTUJ PRZYCHODY/KOSZTY', icon: <EditIcon fontSize="small" /> },
  ];

  return (
    <>
      <div className={`nav ${isOpen ? 'nav--active' : ''}`}>
        <div className="nav__open" onClick={(): void => setIsOpen(!isOpen)}>
          {isOpen ? <CloseIcon/> : <LaunchIcon/>}
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
