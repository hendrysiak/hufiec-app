import BungalowIcon from '@mui/icons-material/Bungalow';
import HomeIcon from '@mui/icons-material/Home';
import ParkIcon from '@mui/icons-material/Park';
import React from 'react';

import { Resource } from 'models/resources.model';


interface MonthPageProps {
  month: number;
  resources: Resource[];
}

const getDaysInMonth = (month: number) => new Date(new Date().getFullYear(), month, 0).getDate();

const MonthPage = (props: MonthPageProps): JSX.Element => {

  const generateIcon = (type: 'tent' | 'bungalow' | 'old-bungalow') => {
    switch (type) {
      case 'tent':
        return <ParkIcon />;
      case 'bungalow':
        return <HomeIcon />;
      case 'old-bungalow':
        return <BungalowIcon />;
    }
  };

  const generateElements = () => {
    const numberOfDays = getDaysInMonth(props.month);

    const renderedItems = [];

    renderedItems.push(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '40px', height: '40px' }}></div>
        {props.resources.map((r, i) => <div style={{ width: '100px', height: '40px', border: '2px solid black', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }} key={i}>
          <span>{r.name}</span> {generateIcon(r.type)}
        </div>)}
      </div>);

    for (let i = 0; i < numberOfDays; i++) {

      renderedItems.push(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid black' }}>
            {i + 1}
          </div>
          {props.resources.map((r, i) => <div style={{ width: '40px', height: '40px', border: '2px solid black' }} key={i}></div>)}
        </div>);
    }
    return renderedItems;
  };

  return (
    <div style={{ display: 'flex' }}>
      {generateElements()}
      {/* {`Month has ${getDaysInMonth(props.month)} days`} */}
    </div>
  );
};

export default MonthPage;
