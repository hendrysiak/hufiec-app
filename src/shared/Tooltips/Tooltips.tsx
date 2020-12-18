import React from 'react';

import Form from 'shared/Form/Form';
import TeamFinanses from 'shared/TeamFinanses/TeamFinanses';
import TeamPage from 'shared/TeamPage/TeamPage';
import './style.css';


interface IMember {
  id: number | string, 
  lp: number | string,
  name: string,
  surname: string,
  cash: number,
  event: string,
  importDate: string,
  team: string,
  title: string,
  year: number,
}
interface IProps {
  icon: string,
  members: IMember[];
  // payment: IMember[],
  incomes: number,
}

const Tooltips = ({ members, incomes }: IProps) => {
  return (
    <>
      <div className="tooltips">
        <TeamPage members={members} icon="M"/>
        <Form title="WYŚLIJ ZGŁOSZENIE" icon="F"/>
        <TeamFinanses incomes={incomes} icon="K"/>
      </div>
    </>
  );
};

export default Tooltips;