"use client"

import Alert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ReactElement, createContext, useContext, useState } from 'react';

interface Props {
  children: ReactElement | ReactElement[]
}

interface SnackbarValues {
  setSnackbar: (action: Pick<AlertProps, 'children' | 'severity'> | null) => void;
}

const SnackBarContextValues: SnackbarValues = {
  setSnackbar: () => () => null,
};

const SnackBarContext = createContext<SnackbarValues>(SnackBarContextValues);

function SnackBarProvider(props: Props): JSX.Element {
  const [snackbar, setSnackbar] = useState<Pick<
  AlertProps,
  'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <SnackBarContext.Provider value={{
      setSnackbar,
    }}
    >
      {props.children}
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} variant="filled" onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </SnackBarContext.Provider>
  );
}

export const useSnackbar = (): SnackbarValues => useContext(SnackBarContext);

export default SnackBarProvider;
