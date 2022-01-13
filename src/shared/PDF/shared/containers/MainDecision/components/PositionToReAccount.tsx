import { Text, View, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

import { ReAccoutingInfo } from 'models/decision.model';

interface PositionToReAccountProps {
  index: number;
  reAccountingInfo: ReAccoutingInfo;
}

const styles = StyleSheet.create({
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

const PositionToReAccount = (props: PositionToReAccountProps): JSX.Element => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.cell}>{props.index + 1}</Text>
      <Text style={{ ...styles.cell, ...styles.cell2 }}>{props.reAccountingInfo.letterNumber}</Text>
      {/* <Text style={styles.cell}>{props.reAccountingInfo.letterNumber}</Text> */}
      <Text style={{ ...styles.cell, ...styles.cell2 }}>{props.reAccountingInfo.cash}</Text>
      <Text style={{ ...styles.cell, ...styles.cell3 }}>{`Przeksięgowano na: ${props.reAccountingInfo.targetCode}`}</Text>
    </View>
  );
};

export default PositionToReAccount;
