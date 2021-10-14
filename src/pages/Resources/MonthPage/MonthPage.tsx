
import { Typography } from '@mui/material';
import Popover from '@mui/material/Popover';
import React from 'react';

import { Resource } from 'models/resources.model';

import { generateIcon } from '../Resources';


interface MonthPageProps {
  month: number;
  resources: Resource[];
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

      renderedItems.push(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid black' }}>
            {i + 1}
          </div>
          {props.resources.map((r, i) => (<div onClick={(e) => handleClick(e, r.name)} style={{ width: '40px', height: '40px', border: '2px solid black' }} key={i}></div>))}
        </div>);
    }
    return renderedItems;
  };

  return (
    <div style={{ display: 'flex' }}>
      {generateElements()}
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
