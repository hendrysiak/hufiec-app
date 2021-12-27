import React from 'react';

import logo from 'assets/generator/logo.png';

import Disclaimer from '../../components/Disclaimer/Disclaimer';

interface HeaderProps {
  recipient: string;
}

const Header = (props: HeaderProps): JSX.Element => {
  return (
    <header className="header">
      <img src={logo} />
      <Disclaimer recipient={props.recipient} />
    </header>
  );
};

export default Header;
