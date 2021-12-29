import React from 'react';

import { LogOut } from 'shared/LogOut/LogOut';

import Navigation from 'shared/Navigation/Navigation';

interface NavigationContainerProps {
  children: React.ReactChild | React.ReactChild[];
  team: string | null;
}

const NavigationContainer = (props: NavigationContainerProps): JSX.Element => {
  
  return (
    <>
      {props.team !== null || props.team !== '' ? <Navigation /> : <></>}
      {props.children}
      <LogOut />
    </>
  );
};

export default NavigationContainer;
