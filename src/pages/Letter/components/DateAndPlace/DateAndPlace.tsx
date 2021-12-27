import React from 'react';

const DateAndPlace = (): JSX.Element => {
  const today = new Date().toLocaleDateString();
  return (
    <p>
      {`Ruda Śląska, ${today} r.`}
    </p>
  );
};

export default DateAndPlace;
