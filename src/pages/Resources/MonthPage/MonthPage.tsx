
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import React from 'react';

import { ReservationMapElement, Resource, ResourceMapElement } from 'models/resources.model';

import { generateIcon } from '../Resources';


const temporaryReservation = [{
  id: '1',
  startDate: new Date('10.10.2021').toLocaleDateString(),
  endDate: new Date('12.10.2021').toLocaleDateString(),
  startMonth: 9,
  startDay: 10,
  endMonth: 9,
  endDay: 12,
  resources: ['K1', 'G2', 'G3'],
  name: 'Pilecki',
  color: '#914545',
}];

export const generateListOfDay = (startDate: string, endDate: string, steps = 1): string[] => {
  const splitedStartDate = startDate.split('.');
  const splitedEndDate = endDate.split('.');
  const dateArray = [];
  const currentDate = new Date(`${splitedStartDate[1]}.${splitedStartDate[0]}.${splitedStartDate[2]}`);

  while (currentDate <= new Date(`${splitedEndDate[1]}.${splitedEndDate[0]}.${splitedEndDate[2]}`)) {
    dateArray.push(new Date(currentDate).toLocaleDateString());
    // Use UTC date to prevent problems with time zones and DST
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }
  return dateArray;
};

// {
//   'K1': {
//     '10.10.2021': {
//       id: '1'
//     }
//   }
// }

// {
//   ':ID': {
//     name: 'Pilecki',
//     numberOfPerson: ''
//   }
// }


// const dates = generateListOfDay(temporaryReservation[0].startDate, temporaryReservation[0].endDate);
// console.log(dates);

interface MonthPageProps {
  month: number;
  resources: Resource[];
  resourceMap: ResourceMapElement;
  reservations: ReservationMapElement;
  year: number;
}

const getDaysInMonth = (month: number) => new Date(new Date().getFullYear(), month, 0).getDate();

const MonthPage = (props: MonthPageProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [content, setContent] = React.useState('');

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, content: string) => {
    setAnchorEl(event.currentTarget);
    setContent(content);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setContent('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
      const day = i + 1;

      renderedItems.push(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid black' }}>
            {day}
          </div>

          {props.resources.map((r, i) => {
            // year and month changing
            const currentReservationId = props.resourceMap?.[r.name]?.[`${day}.${props.month}.${props.year}`];
            const currentStyle = currentReservationId ? { backgroundColor: props.reservations[currentReservationId].color } : { backgroundColor: 'transparent' };
            const currentInfo = currentReservationId 
              ? `Rezerwacja dla ${props.reservations[currentReservationId].name} na ${props.reservations[currentReservationId].numberOfPersons} osób` 
              : r.name;
            
            return (<div 
              onClick={(e) => handleClick(e, currentInfo)} 
              style={{ width: '40px', height: '40px', border: '2px solid black', ...currentStyle }} 
              key={i}
            ></div>);
          })}

        </div>);
    }
    return renderedItems;
  };

  const generatedElements = React.useMemo(() => generateElements(), [props.reservations, props.resourceMap, props.month]);

  return (
    <div style={{ display: 'flex' }}>
      {generatedElements}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{content}</Typography>
      </Popover>
      {/* {`Month has ${getDaysInMonth(props.month)} days`} */}
    </div>
  );
};

export default MonthPage;
