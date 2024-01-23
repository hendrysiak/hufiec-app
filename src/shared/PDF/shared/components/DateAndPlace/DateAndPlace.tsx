import { Text } from '@react-pdf/renderer';

import React from 'react';

interface DateAndPlaceProps {
  date?: Date | string;
}

function DateAndPlace(props: DateAndPlaceProps): JSX.Element {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', year: 'numeric', month: '2-digit' }).replaceAll('/', '.');
  return (
    <Text>
      {`Ruda Śląska, ${props.date && new Date(props.date).toLocaleDateString('en-GB', { day: '2-digit', year: 'numeric', month: '2-digit' }).replaceAll('/', '.') || today} r.`}
    </Text>
  );
}

export default DateAndPlace;
