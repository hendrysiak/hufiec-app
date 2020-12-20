import React from 'react';

import { Person } from 'models/registry.models';
import Form from 'shared/Form/Form';
import TeamFinanses from 'shared/TeamFinanses/TeamFinanses';
import TeamPage from 'shared/TeamPage/TeamPage';

import classes from './Tooltips.module.css';


interface IProps {
  icon?: string,
  members: Person[];
  incomes: number | null,
  currentTeam: string;
}

const Tooltips = ({ members, incomes, currentTeam }: IProps) => {
  console.log(incomes);
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