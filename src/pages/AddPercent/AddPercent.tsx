import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios-income';

import { updateOnePercent } from 'helpers/editing-db.handler';
import { Amount } from 'models/income.models';
import Navigation from 'shared/Navigation/Navigation';
import { RootState } from 'store/models/rootstate.model';

import classes from './AddPercent.module.css';
import OneTeam from './OneTeam/OneTeam';



const AddPercent: FC = () => {
  const registry = useSelector((state: RootState) => state.income.registry);
  const [amount, setAmount] = useState<Amount>();

  const getData = async () => {
    const result = await axios.get(`/onePercent.json`);
    setAmount(result.data);
  };

  useEffect(() => {
    getData();
  },[registry]);

  return (
    <>
      <Navigation />
      {registry && amount && Object.keys(registry).map((el, index) => <OneTeam key={index} team={el} amount={amount[el]}/> )} 
    </>
  );
};

export default AddPercent;