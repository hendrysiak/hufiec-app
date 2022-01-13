import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { Decision, DecisionReAccouting } from 'models/decision.model';
import { DecisionArea } from 'models/global.enum';
import { IncomeDb } from 'models/income.models';

import DateAndPlace from '../../components/DateAndPlace/DateAndPlace';

import ReAccouting from './ReAccouting';


interface MainProps {
  decision: Decision;
}

const styles = StyleSheet.create({
  mainContent: {
    width: '100%',
    alignSelf: 'flex-start',
    flex: 5,
  },
  header: {
    textAlign: 'right',
  },
  author: {
    display: 'flex',
    flexDirection: 'column'
  }
});

const Main = (props: MainProps): JSX.Element => {

  const contentGenerator = () => {
    switch (props.decision.area) {
      case DecisionArea.ReAccount:
        return <ReAccouting decision={props.decision as DecisionReAccouting}/>;
    }
  };

  return (
    <View style={styles.mainContent}>
      <View style={styles.header}>
        {/* <View style={styles.author}>
          {props.author?.split(',').map(el => <Text key={el}>{el}</Text>)}
        </View> */}
        <DateAndPlace date={props.decision.decisionDate as Date} />
      </View>
      {contentGenerator()}
    </View>
  );
};

export default Main;
