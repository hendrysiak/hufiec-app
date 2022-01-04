
import Alert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React from 'react';

interface Props {
  children: React.ReactElement | React.ReactElement[]
};

interface SnackbarValues {
  setSnackbar: (action: Pick<AlertProps, 'children' | 'severity'> | null) => void;
}
  
const SnackBarContextValues: SnackbarValues = {
  setSnackbar: () => () => null,
};
  
const SnackBarContext = React.createContext<SnackbarValues>(SnackBarContextValues);


const SnackBarProvider = (props: Props): JSX.Element => {
  const [snackbar, setSnackbar] = React.useState<Pick<
  AlertProps,
  'children' | 'severity'
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <SnackBarContext.Provider value={{
      setSnackbar
    }}>
      {props.children}
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </SnackBarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarValues => React.useContext(SnackBarContext);

export default SnackBarProvider;


