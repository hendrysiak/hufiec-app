import { makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BungalowIcon from '@mui/icons-material/Bungalow';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import HouseIcon from '@mui/icons-material/House';
import ParkIcon from '@mui/icons-material/Park';
import { Box } from '@mui/material';
import React from 'react';

import { MappedReservation, Reservation, ReservationMapElement, Resource, ResourceMapElement } from 'models/resources.model';

import PageWrapper from 'shared/PageWrapper/PageWrapper';
import { TabPanel } from 'shared/TabPanel/TabPanel';

import MonthPage, { generateListOfDay } from './MonthPage/MonthPage';
import ReservationEditor from './ReservationEditor/ReservationEditor';

export const generateIcon = (type: 'tent' | 'bungalow' | 'old-bungalow' | 'house' | 'main'): JSX.Element => {
  switch (type) {
    case 'tent':
      return <ParkIcon />;
    case 'bungalow':
      return <HomeIcon />;
    case 'old-bungalow':
      return <BungalowIcon />;
    case 'house':
      return <HouseIcon />;
    case 'main':
      return <BusinessIcon />;
  }
};

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień'
];

const Resources = (): JSX.Element => {

  const useStyles = makeStyles((theme: Theme) => ({
    dayWithDotContainer: {
      position: 'relative'
    },
    dayWithDot: {
      position: 'absolute',
      height: 0,
      width: 0,
      border: '2px solid',
      borderRadius: 4,
      borderColor: theme.palette.primary.main,
      right: '50%',
      transform: 'translateX(1px)',
      top: '80%'
    },
    customTooltip: {
      // I used the rgba color for the standard "secondary" color
      fontSize: '16px',
      color: 'white'
    },
    icon: {
      width: '24px',
      height: '24px'
    },
    button: {
      color: 'white'
    },
    indicator: {
      backgroundColor: 'white',
    },
  }));
      
  const classes = useStyles();


  const [tab, setTab] = React.useState(0);
    
  const [currentMonth, setCurrentMonth] = React.useState(0);
  const [currentYear, setCurrentYear] = React.useState(1970);
  const [reservations, setReservations] = React.useState<ReservationMapElement>({});
  const [resourceMap, setResourceMap] = React.useState<ResourceMapElement>({});

  const setDays = (resourceMap: ResourceMapElement, resource: string, usedDays: string[], id: string) => {
    console.log(usedDays);
    usedDays.forEach(day => {
      resourceMap[resource][day] = id;
      // if (resourceMap[resource][day]) {
      //   resourceMap[resource][day].push(id);
      // } else {
      //   resourceMap[resource][day] = [id];
      // }

    });
    return resourceMap;
  };

  const temporaryResourceCapacityhandler = (reservation: Reservation, id: string) => {
    let resources = { ...resourceMap };
    const usedDays = generateListOfDay(reservation.startDate, reservation.endDate);
    
    reservation.resources.forEach(resource => {
      if (resources[resource]) {
        resources = setDays(resources, resource, usedDays, id);
      } else {
        resources[resource] = {};
        resources = setDays(resources, resource, usedDays, id);
      }
    });

    setResourceMap(resources);
  };

  const temporarySaveReservation = (reservation: Reservation) => {
    const startDate = reservation.startDate.split('.');
    const endDate = reservation.endDate.split('.');
    const id = `${Object.keys(reservations).length}`;

    const mappedReservation: ReservationMapElement = {
      [id]: {
        ...reservation,
        startDay: Number(startDate[0]),
        endDay: Number(endDate[0]),
        startMonth: Number(startDate[1]) - 1,
        endMonth: Number(endDate[1]) - 1,
        id,
      }
    };

    temporaryResourceCapacityhandler(reservation, id);
    setReservations({ ...reservations, ...mappedReservation });
  };

  const resources: Resource[] = [
    { type: 'old-bungalow', availablePlaces: 8, name: 'K1' }, 
    { type: 'old-bungalow', availablePlaces: 8, name: 'K2' }, 
    { type: 'old-bungalow', availablePlaces: 8, name: 'K3' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G1' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G2' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G3' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G4' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G5' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G6' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G7' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G8' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G9' }, 
    { type: 'bungalow', availablePlaces: 10, name: 'G10' }, 
    { type: 'tent', availablePlaces: 100, name: 'Dolinka' }, 
    { type: 'tent', availablePlaces: 100, name: 'Jałowce' }, 
    { type: 'tent', availablePlaces: 40, name: 'PPOŻ' }, 
    { type: 'tent', availablePlaces: 60, name: 'Dąbki' }, 
    { type: 'house', availablePlaces: 5, name: 'Borowik' }, 
    { type: 'house', availablePlaces: 5, name: 'Jagódka' }, 
    { type: 'house', availablePlaces: 5, name: 'Poziomka' }, 
    { type: 'house', availablePlaces: 5, name: 'Purchawka' }, 
    { type: 'house', availablePlaces: 4, name: 'Żwirek' }, 
    { type: 'house', availablePlaces: 4, name: 'Muchomorek' }, 
    { type: 'main', availablePlaces: 50, name: 'Hufiec' }, 
  ];

  React.useEffect(() => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }, []);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeMonth = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (currentMonth < 11) {
        setCurrentMonth(currentMonth + 1);
      } else {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };


  return (
    <PageWrapper>
      <div style={{ backgroundColor: 'rgba(92, 56, 150, 1)', color: 'white' }}>
        <Tabs value={tab} variant="fullWidth" classes={{ indicator: classes.indicator }} onChange={handleTabChange} style={{ flex: 3 }}>
          <Tab label="Rezerwacje" />
          <Tab label="Dodaj rezerwację" />
          {/* <Tab label="Edytuj zasoby" /> */}
          {/* <Tab label="Wyślij wiadomość" /> */}
        </Tabs>
      </div>
      <Box p={4}>
        <TabPanel value={tab} index={0}>
          {`Miesiąc: ${months[currentMonth]}, Rok ${currentYear}`}
          <div style={{ display: 'flex', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <ChevronLeftIcon onClick={() => handleChangeMonth('prev')} style={{ cursor: 'pointer', fontSize: '44px' }}/> 
            <MonthPage
              month={currentMonth + 1}
              resources={resources}
              reservations={reservations}
              resourceMap={resourceMap}
              year={currentYear}
            />
            <ChevronRightIcon onClick={() => handleChangeMonth('next')} style={{ cursor: 'pointer', fontSize: '44px' }}/>
          </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ReservationEditor resources={resources} saveReservation={temporarySaveReservation}/>
        </TabPanel>
      </Box>
    </PageWrapper>
  );
};

export default Resources;


