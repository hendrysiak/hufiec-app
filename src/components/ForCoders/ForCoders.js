import React from 'react';
import axios from '../../axios-income';
import axiosStandard from 'axios';
import jsonData from './tosend.json'

const ForCoders = () => {

const handleSendingData = async () => {
  const response = await axios.put('/teams.json/', jsonData);

}

  return (
    <section className="Section">
      <input type="text"/>
      <button onClick={handleSendingData}>Wyślij dane</button>
    </section>
  )
}

export default ForCoders;
