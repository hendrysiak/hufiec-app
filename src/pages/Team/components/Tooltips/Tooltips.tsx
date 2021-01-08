import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';

import { Person } from 'models/registry.models';
import Form from 'pages/Team/components/Form/Form';

import TeamFinances from 'pages/Team/components/TeamFinances/TeamFinances';
import TeamPage from 'pages/Team/components/TeamPage/TeamPage';

import classes from './Tooltips.module.css';


interface IProps {
  icon?: string,
  members: Person[];
  incomes: number | null,
  currentTeam: string;
}

const Tooltips = ({ members, incomes, currentTeam }: IProps) => {
  return (
    <>
      <div className={classes.tooltips}>
        <Tooltip title="Członkowie drużyny">
          <IconButton aria-label="members">
            <TeamPage members={members}/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Wyślij zgłoszenie">
          <IconButton aria-label="support">
            <Form title="WYŚLIJ ZGŁOSZENIE"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Stan konta drużyny">
          <IconButton aria-label="account-state">
            <TeamFinances incomes={incomes} currentTeam={currentTeam}/>
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
};

export default Tooltips;