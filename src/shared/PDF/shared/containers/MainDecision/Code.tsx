import { StyleSheet, View, Text } from '@react-pdf/renderer';
import React from 'react';

import { codePattern } from 'helpers/event.helper';
import { DecisionCode } from 'models/decision.model';
import { eventDateGenerator } from 'shared/eventDate.helper';

interface ExtendedDecision extends DecisionCode {
  teamNameToUse: string
};

interface CodeProps {
  decision: ExtendedDecision;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  title: {
    alignSelf: 'center',
    margin: '16px 0',
    fontWeight: 900,
    textAlign: 'center',
  },
  mainText: {
    textAlign: 'justify',
  },
});

function Code(props: CodeProps): JSX.Element {
  const decisionDate = new Date(props.decision.decisionDate);
  const team = props.decision.teamNameToUse;
  const event = codePattern.find((code) => code.value === props.decision.prefix)?.name;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`
          Decyzja Komendanta i Skarbnika Hufca ZHP Ruda Śląska 
          nr ${props.decision.decisionId}/${decisionDate.getFullYear()} z dnia ${decisionDate.toLocaleDateString('en-GB', { day: '2-digit', year: 'numeric', month: '2-digit' }).replaceAll('/', '.')} 
          o przyjęciu dodatkowej składki członkowskiej zadaniowej na ${event || 'wyjazd'} ${props.decision.target} 
          `}
      </Text>
      <Text style={styles.title}>§1</Text>
      <Text style={styles.mainText}>
        {`
      Działając na podstawie §52, ust. 2, pkt 8 i §78 ust. 1 pkt 2 Statutu ZHP oraz Uchwały
      Głównej Kwatery ZHP nr 123/2012 z dnia 11 października 2012 r. w sprawie 
      zatwierdzenia Instrukcji w sprawie dodatkowej składki członkowskiej zadaniowej 
      Komendant oraz Skarbnik Hufca Związku Harcerstwa Polskiego Ruda Śląska im. 
      hm. Łucji Zawada podjęli decyzję o przyjęciu dodatkowej składki zadaniowej
      na ${event} ${team ?? ''} ${props.decision.target} w wysokości ${props.decision.amount} złotych od osoby w terminie ${eventDateGenerator(props.decision)}.
          `}
      </Text>
      <Text style={styles.title}>§2</Text>
      <Text style={styles.mainText}>
        Decyzja wchodzi w życie z dniem podjęcia.
      </Text>
    </View>
  );
}

export default Code;
