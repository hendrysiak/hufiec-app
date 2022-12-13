import { View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { Decision, DecisionCode, DecisionReAccouting } from 'models/decision.model';
import { DecisionArea } from 'models/global.enum';

import DateAndPlace from '../../components/DateAndPlace/DateAndPlace';

import Code from './Code';
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
    flexDirection: 'column',
  },
});

function Main(props: MainProps): JSX.Element {
  const contentGenerator = () => {
    switch (props.decision.area) {
      case DecisionArea.ReAccount:
        return <ReAccouting decision={props.decision as DecisionReAccouting} />;
      case DecisionArea.Code:
        return <Code decision={props.decision as DecisionCode} />;
    }
  };

  return (
    <View style={styles.mainContent}>
      <View style={styles.header}>
        <DateAndPlace date={props.decision.decisionDate as Date} />
      </View>
      {contentGenerator()}
    </View>
  );
}

export default Main;
