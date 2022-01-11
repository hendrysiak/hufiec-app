import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { ProposalArea, ProposalKind } from 'models/global.enum';
import { IncomeDb } from 'models/income.models';
import DateAndPlace from 'pages/Letter/components/DateAndPlace/DateAndPlace';

import ReAccouting from './ReAccouting';

interface MainProps {
  author?: string;
  area: ProposalArea;
  kind: ProposalKind;
  oldValues: unknown;
  newValues: unknown;
}

const styles = StyleSheet.create({
  mainContent: {
    width: '100%',
    alignSelf: 'flex-start',
    flex: 5,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const Main = (props: MainProps): JSX.Element => {

  const contentGenerator = () => {
    switch (props.area) {
      case ProposalArea.Income:
        return <ReAccouting oldValues={props.oldValues as IncomeDb} newValues={props.newValues as IncomeDb}/>;
    }
  };

  return (
    <View style={styles.mainContent}>
      <View style={styles.header}>
        <View style={styles.author}>
          {props.author?.split(',').map(el => <Text key={el}>{el}</Text>)}
        </View>
        <DateAndPlace />
      </View>
      {contentGenerator()}
    </View>
  );
};

export default Main;
