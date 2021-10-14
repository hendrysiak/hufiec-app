import React from 'react';

import { LogOut } from 'shared/LogOut/LogOut';

import Navigation from 'shared/Navigation/Navigation';

interface PageWrapperProps {
  children: React.ReactNode | React.ReactNode[];
};

const PageWrapper = (props: PageWrapperProps): JSX.Element => {
  return (
    <div>
      <Navigation />
      <LogOut />
      {props.children}
    </div>
  );
};

export default PageWrapper;
