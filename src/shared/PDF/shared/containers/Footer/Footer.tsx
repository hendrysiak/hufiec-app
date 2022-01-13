import { Image, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

import hufiecLogo from 'assets/generator/hufiec-logo.jpg';
import scoutLogo from 'assets/generator/scout-logo.png';


const styles = StyleSheet.create({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    height: '60px'
  },
  scouts: {
    height: '40px',
    alignSelf: 'flex-end'
  }
});

const Footer = (): JSX.Element => {
  return (
    <View style={styles.footer}>
      <Image src={hufiecLogo} style={styles.img}/>
      <Image src={scoutLogo} style={styles.scouts}/>
    </View>
  );
};

export default Footer;
