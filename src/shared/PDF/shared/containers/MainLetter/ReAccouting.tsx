import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { IncomeDb } from 'models/income.models';

interface ReAccoutingProps {
  oldValues: IncomeDb;
  newValues: IncomeDb;
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

function ReAccouting(props: ReAccoutingProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PROŚBA</Text>
      <Text style={styles.mainText}>
        {`Zwracam się z prośbą o przeksięgowanie przelewu na kwotę ${props.oldValues.cash}, wykonanego dnia 
            ${new Date(props.oldValues.dateOfBook).toLocaleDateString()}, tytułem:
            ${props.oldValues.title}, 
            na:
            ${props.newValues.year}-${props.newValues.name} ${props.newValues.surname}-${props.newValues.team}-${props.newValues.event}`}
      </Text>
      <Text style={styles.sign}>Z wyrażami szacunku</Text>
    </View>
  );
}

export default ReAccouting;
