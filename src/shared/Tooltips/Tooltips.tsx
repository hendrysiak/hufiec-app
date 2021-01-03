import React from 'react';

import Form from 'components/Form/Form';

import TeamFinanses from 'components/TeamFinanses/TeamFinanses';
import { Person } from 'models/registry.models';
import TeamPage from 'shared/TeamPage/TeamPage';

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
        <TeamPage members={members}/>
        <Form title="WYŚLIJ ZGŁOSZENIE"/>
        <TeamFinanses incomes={incomes} currentTeam={currentTeam}/>
      </div>
    </>
  );
};

export default Tooltips;