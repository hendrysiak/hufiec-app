import React from 'react';
import { useLocation } from 'react-router';

import { LogOut } from 'shared/LogOut/LogOut';

import Navigation from 'shared/Navigation/Navigation';

interface NavigationContainerProps {
  children: React.ReactChild | React.ReactChild[];
  isAdmin?: boolean;
}

function NavigationContainer(props: NavigationContainerProps): JSX.Element {
  const { pathname } = useLocation();

  return (
    <>
      { props.isAdmin && pathname !== '/login' && pathname !== '/letter' ? <Navigation /> : <></> }
      { props.children }
      { pathname !== '/letter' ? <LogOut /> : <></> }
    </>
  );
}

export default NavigationContainer;
