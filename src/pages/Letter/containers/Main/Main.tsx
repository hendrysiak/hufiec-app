import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import DateAndPlace from 'pages/Letter/components/DateAndPlace/DateAndPlace';

interface MainProps {
  author?: string;
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {}
});

const Main = (props: MainProps): JSX.Element => {
  return (
    <View>
      <View style={styles.header}>
        <Text>{props.author}</Text>
        <DateAndPlace />
      </View>
    </View>
  );
};

export default Main;
