import { Image, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

import logo from 'assets/generator/logo.png';

import Disclaimer from '../../components/Disclaimer/Disclaimer';


interface HeaderProps {
  recipient: string;
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '25px',
    flex: 1,
  },
  img: {
    height: '75px',
  }
});

const Header = (props: HeaderProps): JSX.Element => {
  return (
    <View style={styles.header}>
      <Image src={logo} style={styles.img}/>
      <Disclaimer recipient={props.recipient} />
    </View>
  );
};

export default Header;
