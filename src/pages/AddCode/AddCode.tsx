import React from 'react';

import CodeGenerator from './CodeGenerator/CodeGenerator';

interface AddCodeProps {
  isAdmin?: boolean;
}

const AddCode = (props: AddCodeProps): JSX.Element => {
  return (
    <>
      <CodeGenerator />
    </>
  );
};

export default AddCode;
