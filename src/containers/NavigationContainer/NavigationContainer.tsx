import React from 'react';
import { usePathname } from 'next/navigation'
import { LogOut } from 'shared/LogOut/LogOut';

import Navigation from 'shared/Navigation/Navigation';

interface NavigationContainerProps {
  children: React.ReactElement | React.ReactElement[];
  isAdmin?: boolean;
}

function NavigationContainer(props: NavigationContainerProps): JSX.Element {
  const pathname = usePathname();

  return (
    <>
      { props.isAdmin && pathname !== '/login' && pathname !== '/letter' ? <Navigation /> : <></> }
      { props.children }
      { pathname !== '/letter' ? <LogOut /> : <></> }
    </>
  );
}

export default NavigationContainer;
