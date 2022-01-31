import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { ICode } from 'models/codes.models';
import { ProposalArea, ProposalKind } from 'models/global.enum';
import { IncomeDb } from 'models/income.models';

import DateAndPlace from '../../components/DateAndPlace/DateAndPlace';

import Code from './Code';
import ReAccouting from './ReAccouting';

interface MainProps {
  author?: string;
  area: ProposalArea;
  kind: ProposalKind;
  oldValues: unknown;
  newValues: unknown;
  letterDate?: Date | string;
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
      case ProposalArea.Code:
        return <Code newValues={props.newValues as ICode} />;
    }
  };

  return (
    <View style={styles.mainContent}>
      <View style={styles.header}>
        <View style={styles.author}>
          {props.author?.split(',').map(el => <Text key={el}>{el}</Text>)}
        </View>
        <DateAndPlace date={props.letterDate} />
      </View>
      {contentGenerator()}
    </View>
  );
};

export default Main;
