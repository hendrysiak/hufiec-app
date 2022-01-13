import { Text, View, StyleSheet } from '@react-pdf/renderer';

import React from 'react';

import { DecisionReAccouting } from 'models/decision.model';

import PositionToReAccount from './components/PositionToReAccount';


interface ReAccoutingProps {
  decision: DecisionReAccouting
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
  sign: {
    alignSelf: 'flex-end',
    margin: '32px 0'
  },
  tableContainer: {
    margin: '0 50px',
    width: '80vw',
    display: 'flex',
    flexDirection: 'column',
  },
  rowContainer: {
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    margin: '-1',
    fontSize: '10px',
    padding: '2px 8px',
    border: '1px solid black',
    textAlign: 'center',
    minWidth: '50px',
  },
  cell2: {
    minWidth: '70px'
  },
  cell3: {
    minWidth: '200px'
  }			
});

const ReAccouting = (props: ReAccoutingProps): JSX.Element => {
  const decisionDate = new Date(props.decision.decisionDate);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {`
        Decyzja Komendanta i Skarbnika Hufca ZHP Ruda Śląska 
        nr ${props.decision.decisionId}/${decisionDate.getFullYear()} z dnia ${decisionDate.toLocaleDateString()} 
        o rozpatrzeniu pism w sprawie przeksięgowań wpłat zgodnie z numerami pism
        `}</Text>
      <Text style={styles.title}>§1</Text>
      <Text style={styles.mainText}>{`
      Działając na podstawie §53, ust. 1, pkt 5 Komendant oraz Skarbnik Hufca Związku 
      Harcerstwa Polskiego Ruda Śląska im. hm. Łucji Zawada podjęli decyzję o pozytywnym 
      rozpatrzeniu  następujących pism:
        `}</Text>
      <View style={styles.tableContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.cell}>lp.</Text>
          <Text style={{ ...styles.cell, ...styles.cell2 }}>nr pisma</Text>
          <Text style={{ ...styles.cell, ...styles.cell2 }}>kwota</Text>
          <Text style={{ ...styles.cell, ...styles.cell3 }}>przeksięgowanie</Text>

        </View>
        {props.decision.reAccountingInfo
          .map((info, index) => (
            <PositionToReAccount
              key={info.letterNumber}
              index={index}
              reAccountingInfo={info}
            />))}
      </View>
      <Text style={styles.title}>§2</Text>
      <Text style={styles.mainText}>
        Decyzja wchodzi w życie z dniem podjęcia.
      </Text>
    </View>
  );
};

export default ReAccouting;
