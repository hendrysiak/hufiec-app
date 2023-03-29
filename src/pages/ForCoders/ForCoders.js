import axiosStandard from 'axios';
import React from 'react';

import { useSelector } from 'react-redux';

import axios from 'axios-income';

import Navigation from 'shared/Navigation/Navigation';

import jsonData from './tosend.json';


const ForCoders = () => {

  const registry = useSelector((state) => state.income.registry);

  const handleSendingData = async () => {
    const newRegistry = Object.keys(registry).map(r => {
      return [r, 0];
    });

    console.log(Object.fromEntries(newRegistry));

    // console.log()
  
    // const response = await axios.put('/teams.json/', jsonData);
    const response = await axios.put('/onePercent.json', Object.fromEntries(newRegistry));

  };

  return (<>
    <Navigation />
    <section className="Section">
      <input type="text"/>
      <button onClick={handleSendingData}>Wyślij dane</button>
    </section>
  </>
  );
};

export default ForCoders;
