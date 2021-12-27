import React from 'react';

import Footer from './containers/Footer/Footer';

import Header from './containers/Header/Header';
import Main from './containers/Main/Main';

// Using this way because of overidding body styles
import './Letter.css';

interface LetterProps {
  recipient: string
}

const Letter = (props: LetterProps) => {
  return (
    <div className="page">
      <Header recipient={props.recipient} />
      <Main />
      <Footer />
    </div>
  );
};

export default Letter;
