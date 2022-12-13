import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import React, { CSSProperties } from 'react';

import { useQuery, useQueryClient, useMutation } from 'react-query';

import { getCodes, saveCode } from 'helpers/api-helpers/codes';
import { ICode } from 'models/codes.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';

import { TabPanel } from 'shared/TabPanel/TabPanel';

import CodeExplorer from './CodeExplorer/CodeExplorer';

import CodeGenerator from './CodeGenerator/CodeGenerator';

interface AddCodeProps {
  isAdmin?: boolean;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
  style?: CSSProperties;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    variant="fullWidth"
    textColor="inherit"
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '100%',
    backgroundColor: 'white',
  },
});

function AddCode(props: AddCodeProps): JSX.Element {
  const [tab, setTab] = React.useState(0);

  const query = useQuery<ICode[], Error>('codes', () => getCodes());
  const queryClient = useQueryClient();

  const { setSnackbar } = useSnackbar();

  const saveCodeMutation = useMutation(saveCode, {

    onSuccess: () => {
      queryClient.invalidateQueries('codes');
      setSnackbar({ children: 'Kod zapisany pomyślnie', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ children: 'Wystąpił błąd przy zapisywaniu kodu', severity: 'error' });
    },
  });

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };
  return (
    <>
      <StyledTabs value={tab} onChange={handleTabChange} style={{ width: '100%' }}>
        <Tab label="Lista kodów" />
        <Tab label="Generator kodów" />
      </StyledTabs>
      <TabPanel value={tab} index={0}>
        <CodeExplorer />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CodeGenerator isAdmin={props.isAdmin} />
      </TabPanel>

    </>
  );
}

export default AddCode;
