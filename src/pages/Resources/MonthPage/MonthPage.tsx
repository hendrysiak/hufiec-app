import React from 'react';

interface MonthPageProps {
  month: number;
  resources: string[];
}

const getDaysInMonth = (month: number) => new Date(new Date().getFullYear(), month, 0).getDate();

const MonthPage = (props: MonthPageProps): JSX.Element => {

  const generateElements = () => {
    const numberOfDays = getDaysInMonth(props.month);

    const renderedItems = [];

    renderedItems.push(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '40px', height: '40px' }}></div>
        {props.resources.map((r, i) => <div style={{ width: '40px', height: '40px', border: '2px solid black' }} key={i}>{r}</div>)}
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
