import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import React, { useMemo } from 'react';
import { CSVLink } from 'react-csv';

import { IncomeDb, OutcomeDb } from 'models/income.models';
import { APIPerson } from 'models/registry.models';
import Form from 'pages/Team/components/Form/Form';
import TeamFinances from 'pages/Team/components/TeamFinances/TeamFinances';
import TeamPage from 'pages/Team/components/TeamPage/TeamPage';

import { IViewModal } from '../../../../models/viewModal.models';

import classes from './Tooltips.module.css';

interface IProps {
  open: IViewModal;
  icon?: string;
  members: APIPerson[];
  incomes: IncomeDb[];
  dataToExport: IncomeDb[];
  outcomes: OutcomeDb[];
  currentTeam: string;
}

const Tooltips = ({ open, members, incomes, outcomes, currentTeam, dataToExport }: IProps): JSX.Element => {
  const tooltipStyles = useMemo(() => makeStyles(() => 
    createStyles({
      tooltip: {
        fontSize: 32
      },
    })), []);

  const tooltipsClasses = tooltipStyles();
  
  return <>
    <div className={classes.tooltips}>
      {/* <Tooltip title="" classes={tooltipsClasses}>
        <IconButton aria-label="members">
          <TeamPage members={members} open={open}/>
        </IconButton>
      </Tooltip> */}
      {/* <Tooltip title="" classes={tooltipsClasses}>
        <IconButton aria-label="support">
          <Form title="WYŚLIJ ZGŁOSZENIE" currentTeam={currentTeam} open={open}/>
        </IconButton>
      </Tooltip> */}
      {/* <Tooltip title="" classes={tooltipsClasses}>
        <IconButton aria-label="account-state">
          <TeamFinances incomes={incomes} outcomes={outcomes} currentTeam={currentTeam} open={open}/>
        </IconButton>
      </Tooltip> */}
      {/* <Tooltip title="Wyeksportuj widok do CSV" classes={tooltipsClasses}>
        <CSVLink data={dataToExport} filename={`${currentTeam}.csv`}>
          <IconButton aria-label="account-state" size="large">
            <GetAppIcon/>
          </IconButton>
        </CSVLink>
      </Tooltip> */}
    </div>
  </>;
};

export default Tooltips;