import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { codePattern } from 'helpers/event.helper';
import { useTeams } from 'helpers/hooks/useTeams';
import { ICode } from 'models/codes.models';
import { eventDateGenerator } from 'shared/eventDate.helper';

interface ExtensionForCode extends ICode {
  teamNameToUse: string
}

interface CodeProps {
  newValues: ExtensionForCode;
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
    margin: '32px 0',
  },
  mainText: {
    textAlign: 'justify',
  },
  sign: {
    alignSelf: 'flex-end',
    margin: '32px 0',
  },
});

function Code(props: CodeProps): JSX.Element {
  const event = codePattern.find((c) => c.value === props.newValues.prefix)?.name;
  const team = props.newValues.teamNameToUse;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PROŚBA</Text>
      <Text style={styles.mainText}>
        {`Zwracam się z prośbą o ustalenie dodatkowej składki zadaniowej w wysokości ${props.newValues.amount} zł
      na ${event} ${team} ${props.newValues.locality}, w terminie ${eventDateGenerator(props.newValues)}, jednocześnie proszę o nadanie kodu.`}
      </Text>
      <Text style={styles.sign}>Z wyrażami szacunku</Text>
    </View>
  );
}

export default Code;
