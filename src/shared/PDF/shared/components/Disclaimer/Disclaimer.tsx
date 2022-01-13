import { Text, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';


interface DisclaimerProps {
  recipient: string;
}

const styles = StyleSheet.create({
  disclaimer: {
    textAlign: 'left' as const,
    fontSize: '7.5px',
    width: '165px',
  },
  par: {
    margin: '0 0 0 2px',
  },
  recipient: {
    padding: '4px',
    marginBottom: '4px',
    borderRadius: '5px',
    fontSize: '13px',
    color: 'white',
    backgroundColor: '#6E9F32',
  }
});

const disclaimer = {
  textAlign: 'left' as const,
  fontSize: '7.5px',
  width: '165px',
};

const par = {
  margin: '0 0 0 2px',
};

const recipient = {
  padding: '4px',
  marginBottom: '4px',
  borderRadius: '5px',
  fontSize: '13px',
  color: 'white',
  backgroundColor: '#6E9F32',
};

const Disclaimer = (props: DisclaimerProps): JSX.Element => {
  return (
    <View style={styles.disclaimer}>
      <Text style={styles.recipient}>{props.recipient}</Text>
      <Text style={par}>Chorągiew Śląska ZHP</Text>
      <Text style={par}>Komenda Hufca Ruda Śląska</Text>
      <Text style={par}>im. hm. Łucji Zawada</Text>
      <Text style={par}>41-700 Ruda Śląska, ul. Szczęść Boże 4</Text>
      <Text style={par}>hufiec@rudaslaska.zhp.pl, rudaslaska.zhp.pl </Text>
      <Text style={par}>Bank Śląski 27 1050 1331 1000 0010 0109 0859</Text>
    </View>
    // <div className="disclaimer" style={disclaimer}>
    //   <div className="disclaimer__recipient" style={recipient}>{props.recipient}</div>
    //   <p style={par}>Chorągiew Śląska ZHP</p>
    //   <p style={par}>Komenda Hufca Ruda Śląska</p>
    //   <p style={par}>im. hm. Łucji Zawada</p>
    //   <p style={par}>41-700 Ruda Śląska, ul. Szczęść Boże 4</p>
    //   <p style={par}>hufiec@rudaslaska.zhp.pl, rudaslaska.zhp.pl </p>
    //   <p style={par}>Bank Śląski 27 1050 1331 1000 0010 0109 0859</p>
    // </div>
  );
};

export default Disclaimer;
