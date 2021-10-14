import { makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import BungalowIcon from '@mui/icons-material/Bungalow';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';

import { Box } from '@mui/material';
import React from 'react';

import { Resource } from 'models/resources.model';

import PageWrapper from 'shared/PageWrapper/PageWrapper';
import { TabPanel } from 'shared/TabPanel/TabPanel';

import MonthPage from './MonthPage/MonthPage';
import ReservationEditor from './ReservationEditor/ReservationEditor';

export const generateIcon = (type: 'tent' | 'bungalow' | 'old-bungalow'): JSX.Element => {
  switch (type) {
    case 'tent':
      return <ParkIcon />;
    case 'bungalow':
      return <HomeIcon />;
    case 'old-bungalow':
      return <BungalowIcon />;
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
    { type: 'tent', availablePlaces: 10, name: 'Dolinka' }, 
    { type: 'tent', availablePlaces: 10, name: 'Jałowce' }, 
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
            <MonthPage month={currentMonth + 1} resources={resources}/>
            <ChevronRightIcon onClick={() => handleChangeMonth('next')} style={{ cursor: 'pointer', fontSize: '44px' }}/>
          </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ReservationEditor resources={resources} />
        </TabPanel>
      </Box>
    </PageWrapper>
  );
};

export default Resources;


