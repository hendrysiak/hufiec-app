import { Text } from '@react-pdf/renderer';

import React from 'react';

interface DateAndPlaceProps {
  date?: Date;
}

const DateAndPlace = (props: DateAndPlaceProps): JSX.Element => {
  const today = new Date().toLocaleDateString();
  return (
    <Text>
      {`Ruda Śląska, ${props.date && new Date(props.date).toLocaleDateString() || today} r.`}
    </Text>
  );
};

export default DateAndPlace;
