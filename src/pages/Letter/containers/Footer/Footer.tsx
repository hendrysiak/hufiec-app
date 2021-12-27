import React from 'react';

import hufiecLogo from 'assets/generator/hufiec-logo.jpg';
import scoutLogo from 'assets/generator/scout-logo.png';

const Footer = (): JSX.Element => {
  return (
    <footer className="footer">
      <img src={hufiecLogo} />
      <img className="footer__scouts" src={scoutLogo} />
    </footer>
  );
};

export default Footer;
