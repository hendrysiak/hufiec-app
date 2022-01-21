import { Box, TextField, MenuItem, Theme, IconButton, Button, Tooltip } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import SearchIcon from '@material-ui/icons/Search';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { useState, useEffect, useRef, RefObject, CSSProperties } from 'react';
import { CSVLink } from 'react-csv';
import { useSelector } from 'react-redux';
import {
  useLocation
} from 'react-router-dom';

import { useDebounce } from 'helpers/hooks/useDebounce';
import { useMobileView } from 'helpers/hooks/useMobileView';
import { sortOfSurname } from 'helpers/sorting.helper';
import { IncomeDb, OutcomeDb } from 'models/income.models';
import { APIPerson } from 'models/registry.models';
import { IViewModal } from 'models/viewModal.models';
import CodeGenerator from 'pages/AddCode/CodeGenerator/CodeGenerator';
import Proposals from 'pages/Proposals/Proposals';
import Tooltips from 'pages/Team/components/Tooltips/Tooltips';
import { TabPanel } from 'shared/TabPanel/TabPanel';
import { RootState } from 'store/models/rootstate.model';

import './style.css';
import Form from './components/Form/Form';
import { List } from './components/List/List';
import TeamFinances from './components/TeamFinances/TeamFinances';
import TeamPage from './components/TeamPage/TeamPage';
import { ShowModal } from './helpers/typeViewModal.enum';


interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  style?: CSSProperties;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    variant="fullWidth"
    textColor="inherit"
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: 'white',
  },
});


const Team = (): JSX.Element => {
  const codes = useSelector((state: RootState) => state.income.codes);
  const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
  const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);
  const registry = useSelector((state: RootState) => state.income.registry);
  const importDates = useSelector((state: RootState) => state.income.importDates);
  const [displayedIncome, setDisplayedIncome] = useState<IncomeDb[]>([]);
  const [event, setEvent] = useState<string>('');
  const [currentTeamRegistry, setCurrentTeamRegistry] = useState<APIPerson[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [incomesByCode, setIncomeByCode] = useState<IncomeDb[]>([]);
  const [outcomesByCode, setOutcomeByCode] = useState<OutcomeDb[]>([]);

  const location = useLocation();
  const currentTeam = location.pathname.split('/')[1];
  const [openPopup, setOpenPopup] = useState<IViewModal>(ShowModal.Empty);
  const [rows, setRows] = useState<IncomeDb[]>([]);
  const [useDate, setUseDate] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [navHeight, setNavHeight] = useState<number | null>(null);
  const [tab, setTab] = useState(0);
  const [innerTab, setInnerTab] = useState(0);

  const debouncedName = useDebounce(name, 500);
  const debouncedSurname = useDebounce(surname, 500);


  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const handleInnerTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setInnerTab(newValue);
  };

  const handleDateChange = (date: Date | null) => {
    date && setSelectedDate(date);
  };

  useEffect(() => {
    const teamRegistry = registry
      && registry[currentTeam];
    teamRegistry && setCurrentTeamRegistry(Object.values(teamRegistry));
    const incomesToDisplay = dbIncomes 
      && currentTeam 
      && dbIncomes.filter(income => income.team === currentTeam);
    const outcomesToDisplay = dbOutcomes
      && currentTeam
      && dbOutcomes.filter(income => income.team === currentTeam);
    incomesToDisplay && setIncomeByCode(incomesToDisplay);
    outcomesToDisplay && setOutcomeByCode(outcomesToDisplay);
  }, [registry, dbIncomes, dbOutcomes, currentTeam]);

  useEffect(() => {
    const row = incomesByCode?.length ? (incomesByCode.map((el, index) => {
      return ({
        ...el,
        lp: index + 1,
        dateOfBook: el.dateOfBook.toLocaleString().split(',')[0].split('T')[0]
      });
    })) : ([]);
    setRows(row);
  }, [incomesByCode]);

  useEffect(() => {
    //Write date checker
    const filteredIncomes = rows && rows.filter(i => {
      if (
        useDate
        && selectedDate
        && new Date(i.dateOfBook).toLocaleDateString() !== selectedDate.toLocaleDateString()
      ) return false;
      if (event !== '' && i.event !== event && event !== 'unAssigned') return false;
      if (event !== ''
        && event !== 'unAssigned'
        && !(i.name
          && i.surname
          && i.event
          && i.importDate
          && i.team
          && i.title
          && i.year
          && i.cash)) return false;
      if (event !== ''
        && event === 'unAssigned'
        && i.name
        && i.surname
        && i.event
        && i.importDate
        && i.team
        && i.title
        && i.year
        && i.cash) return false;
      if (name !== '' && !(new RegExp(name, 'gi').test(`${i.name}`))) return false;
      if (surname !== '' && !(new RegExp(surname, 'gi').test(`${i.surname}`))) return false;
      return true;
    });

    sortOfSurname(filteredIncomes, 'ŻŻŻ');
    setDisplayedIncome(filteredIncomes);

  }, [event, selectedDate, incomesByCode, useDate, rows, debouncedName, debouncedSurname]);

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

  const renderDayInPicker = (date: MaterialUiPickersDate,
    selectedDate: unknown,
    dayInCurrentMonth: unknown,
    dayComponent: JSX.Element) => {
    if (importDates && date && importDates.includes(date)) {
      return (<div className={classes.dayWithDotContainer}>
        {dayComponent}
        <div className={classes.dayWithDot} />
      </div>);
    }

    return dayComponent;
  };

  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const navBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listenerScroll = (navBar: RefObject<HTMLDivElement>, scrollY: number): void => {
      if (navBar.current?.clientHeight) {
        setNavHeight(navBar.current?.clientHeight - 1);
        setScrollPosition(scrollY);
      }
    };
    window.addEventListener('scroll', () => listenerScroll(navBar, window.scrollY));
    return () => window.removeEventListener('scroll', () => listenerScroll(navBar, window.scrollY));
  }, [navBar]);

  const isMobile = useMobileView(360);


  return (
    <>
      <div ref={navBar} className={`navTeam ${isMobile && 'navTeam__mobile'}`}>
        <Box display="flex" alignItems="center">
          <p className="team" style={{ flex: 1 }}>{currentTeam}</p>
          <Tooltip title="Otwórz filtry" classes={{
            tooltip: classes.customTooltip
          }}>
            <IconButton aria-label="account-state" onClick={handleOpenFilter} classes={{ root: classes.button }}>
              <SearchIcon fontSize="large" color="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Wyeksportuj widok do CSV" classes={{
            tooltip: classes.customTooltip
          }}>
            <CSVLink data={displayedIncome} filename={`${currentTeam}.csv`}>
              <IconButton aria-label="account-state" classes={{ root: classes.button }}>
                <GetAppIcon fontSize="large" color="inherit" />
              </IconButton>
            </CSVLink>
          </Tooltip>
        </Box>
        <StyledTabs value={tab} onChange={handleTabChange} style={{ width: '100%' }}>
          <Tab label="Lista wpłat" />
          <Tab label="Stan składek" />
          <Tab label="Stan konta" />
          <Tab label="Akcje" />
        </StyledTabs>
      </div>
      <TabPanel value={tab} index={0}>
        <section className="container">
          <div className={`header ${openFilter ? '' : 'filterClose'}`}>
            <div className={`filters ${openFilter ? '' : 'filterClose'}`}>
              <TextField
                classes={{ root: 'teamInput' }}
                label="Po wydarzeniu"
                value={event}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEvent(e.target.value)}
                select={true}
                size="small"
                variant="outlined"
                margin="normal"
                SelectProps={{
                  MenuProps: { disableScrollLock: true }
                }}
              >
                <MenuItem value={''}>{`Wszystkie wydarzenia`}</MenuItem>
                {codes && ['', ...codes.map(code => code.code)].map((item, index: number) => (
                  item ? <MenuItem key={index} value={item}>{item}</MenuItem> : null
                ))}
              </TextField>
              <TextField
                classes={{ root: 'teamInput' }}
                label="Po imieniu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Wpisz imię"
                size="small"
                variant="outlined"
                margin="normal"
              />

              <TextField
                classes={{ root: 'teamInput' }}
                label="Po nazwisku"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Wpisz nazwisko"
                size="small"
                variant="outlined"
                margin="normal"

              />
              <KeyboardDatePicker
                className="datePicker"
                disableToolbar
                disableFuture={true}
                inputVariant="outlined"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Wybierz datę wpływu"
                renderDay={renderDayInPicker}
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <FormControlLabel
                className="dateCheckbox"
                control={<Checkbox
                  checked={useDate}
                  onChange={(e) => setUseDate(e.target.checked)}
                  name="checkedA"
                  color="primary"
                />}
                label="Sortuj po dacie"
              />
              <Button onClick={handleOpenFilter} variant="contained" color="secondary">
                ZAMKNIJ FILTRY
              </Button>
            </div>
            <div style={{ display: 'none' }}><Tooltips
              open={openPopup}
              members={currentTeamRegistry}
              incomes={incomesByCode}
              outcomes={outcomesByCode}
              currentTeam={currentTeam}
              dataToExport={displayedIncome}
            />
            </div>
          </div>
          <div className="containerDataGrid">
            {displayedIncome?.length ? (
              <List navHeight={navHeight} scrollPosition={scrollPosition} rows={displayedIncome.sort((a, b) => {
                if (!a.name || !a.surname || !a.dateOfBook || !a.title || !a.event || !a.cash) {
                  return -1;
                }
                return 1;
              })} />
            ) : (
              <div className="loadingInfo">brak wpłat na ten filtr</div>
            )}
          </div>
        </section>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <TeamPage members={currentTeamRegistry} navHeight={Number(navBar.current?.clientHeight)} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <TeamFinances incomes={incomesByCode} outcomes={outcomesByCode} currentTeam={currentTeam} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Tabs 
          value={innerTab} 
          variant="fullWidth"
          textColor="secondary"
          indicatorColor="secondary"
          onChange={handleInnerTabChange}
        >
          <Tab label="Kody" />
          <Tab label="Podjęte akcje" />
          <Tab label="Wyślij wiadomość" />
          <Tab label="Poradnik" />
        </Tabs>
        <TabPanel value={innerTab} index={0}>
          <CodeGenerator />
        </TabPanel>
        <TabPanel value={innerTab} index={1}>
          <Proposals height="65vh" />
        </TabPanel>
        <TabPanel value={innerTab} index={2}>
          <Form title="WYŚLIJ ZGŁOSZENIE" currentTeam={currentTeam} navHeight={Number(navBar.current?.clientHeight)} />
        </TabPanel>
        <TabPanel value={innerTab} index={3}>
          <h2>Poradnik</h2>
        </TabPanel>
        {/* <Form title="WYŚLIJ ZGŁOSZENIE" currentTeam={currentTeam} navHeight={Number(navBar.current?.clientHeight)} /> */}
      </TabPanel>
    </>
  );
};

export default Team;