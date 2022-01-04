import { Text } from '@react-pdf/renderer';

import React from 'react';

const DateAndPlace = (): JSX.Element => {
  const today = new Date().toLocaleDateString();
  return (
    <Text>
      {`Ruda Śląska, ${today} r.`}
    </Text>
  );
};

export default DateAndPlace;
