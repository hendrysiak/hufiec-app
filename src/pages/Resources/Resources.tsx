import { makeStyles, Tab, Tabs, Theme } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';

import PageWrapper from 'shared/PageWrapper/PageWrapper';
import { TabPanel } from 'shared/TabPanel/TabPanel';

import MonthPage from './MonthPage/MonthPage';


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
          <Tab label="Edytuj zasoby" />
          {/* <Tab label="Wyślij wiadomość" /> */}
        </Tabs>
      </div>
      <TabPanel value={tab} index={0}>
        {`Miesiąc: ${months[currentMonth]}, Rok ${currentYear}`}
        <div style={{ display: 'flex', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
          <ChevronLeftIcon onClick={() => handleChangeMonth('prev')} style={{ cursor: 'pointer', fontSize: '44px' }}/> 
          <MonthPage month={currentMonth + 1} resources={['K1', 'K2', 'K3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10']}/>
          <ChevronRightIcon onClick={() => handleChangeMonth('next')} style={{ cursor: 'pointer', fontSize: '44px' }}/>
        </div>
      </TabPanel>
    </PageWrapper>
  );
};

export default Resources;


