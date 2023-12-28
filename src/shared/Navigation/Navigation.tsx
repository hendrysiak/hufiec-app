import AddBoxIcon from '@mui/icons-material/AddBox';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GroupsIcon from '@mui/icons-material/Groups';
import LaunchIcon from '@mui/icons-material/Launch';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
// import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import TableChartIcon from '@mui/icons-material/TableChart';

import React, { useEffect } from 'react';

import NavigationItem from './NavigationItems/NavigationItem/NavigationItem';

function Navigation(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    document.body.addEventListener('click', (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (target
        && !(target.classList.contains('nav__open') || target.classList.contains('nav__open--icon'))
      ) setIsOpen(false);
    });
  }, []);

  const navigation = [
    { link: '/dashboard', title: 'STRONA GŁÓWNA', icon: <TableChartIcon fontSize="small" /> },
    { link: '/account', title: 'STANY KONT', icon: <TableChartIcon fontSize="small" /> },
    { link: '/decisions', title: 'DECYZJE DO PODJĘCIA', icon: <AllInboxIcon fontSize="small" /> },
    { link: '/proposals', title: 'AKCJE DO PODJĘCIA', icon: <FactCheckIcon fontSize="small" /> },
    { link: '/transfers', title: 'PRZELEWY - OBSŁUGA', icon: <AttachMoneyIcon fontSize="small" /> },
    // { link: '/codes', title: 'FILTRUJ PO KODZIE', icon: <CodeIcon fontSize="small" /> },
    { link: '/add-code', title: 'KODY', icon: <AddBoxIcon fontSize="small" /> },
    // { link: '/add-approval', title: 'DODAJ ZATWIERDZENIE', icon: <PlaylistAddIcon fontSize="small" /> },
    // { link: '/add-billing', title: 'DODAJ ROZLICZENIE', icon: <PlaylistAddCheckIcon fontSize="small" /> },
    { link: '/editor', title: 'EDYTUJ PRZYCHODY/KOSZTY', icon: <EditIcon fontSize="small" /> },
    { link: '/editor-team', title: 'EDYTUJ DRUŻYNĘ', icon: <EditIcon fontSize="small" /> },
    { link: '/addpercent', title: 'DODAJ 1%', icon: <EditIcon fontSize="small" /> },
    { link: '/users', title: 'ZARZĄDZAJ ROLAMI', icon: <PeopleAltIcon fontSize="small" /> },
    { link: '/teams', title: 'ZARZĄDZAJ DRUŻYNAMI', icon: <GroupsIcon fontSize="small" /> },
  ];

  return (
    <div className={`nav ${isOpen ? 'nav--active' : ''}`}>
      <div className="nav__open" onClick={(): void => setIsOpen(!isOpen)}>
        {isOpen ? <CloseIcon /> : <LaunchIcon className="nav__open--icon" />}
      </div>
      {navigation.map((nEl, index: number) => (
        <NavigationItem
          key={index}
          link={nEl.link}
          exact
        >
          <>
            {nEl.icon}
            <span>{`${nEl.title}`}</span>
          </>
        </NavigationItem>
      ))}
    </div>
  );
}

export default Navigation;
