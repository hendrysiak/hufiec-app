import {
  Box, MenuItem, Select, SelectChangeEvent, Typography,
} from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';

import { useLocation } from 'react-router';

import { getProposals } from 'helpers/api-helpers/proposal';
import { ProposalArea } from 'models/global.enum';
import { Proposal } from 'models/proposal.models';

import CodeProposal from './CodeProposal/CodeProposal';
import IncomeProposal from './IncomeProposal/IncomeProposal';
import RegistryProposal from './RegistryProposal/RegistryProposal';

const proposalsList = [
  { name: 'akcje przelewów', value: 'income' },
  { name: 'akcje kodów', value: 'code' },
  { name: 'akcje ewidencji', value: 'registry' },
];

interface ProposalsProps {
  isAdmin?: boolean;
  height: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function Proposals(props: ProposalsProps): JSX.Element {
  const [selectedProposalState, setSelectedProposalState] = React.useState({ name: 'akcje przelewów', value: 'income' });
  const { pathname } = useLocation();
  const query = useQuery<Proposal[], Error>('proposal', () => getProposals(pathname.slice(1), props.isAdmin));

  const handleFilterActions = (value: string): void => {
    const foundedAction = proposalsList.find((p) => p.value === value);

    if (foundedAction) setSelectedProposalState(foundedAction);
  };

  const renderCorrectProposalTable = () => {
    switch (selectedProposalState.value) {
      case 'code':
        return (
          <CodeProposal
            rows={!query?.data ? [] : query.data.filter((data) => data.area === ProposalArea.Code)}
            isAdmin={props.isAdmin}
          />
        );
      case 'registry':
        return (
          <RegistryProposal
            rows={!query?.data ? [] : query.data.filter((data) => data.area === ProposalArea.Registry)}
            isAdmin={props.isAdmin}
          />
        );
      case 'income':
        return (
          <IncomeProposal
            rows={!query?.data ? [] : query.data.filter((data) => data.area === ProposalArea.Income)}
            isAdmin={props.isAdmin}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <main style={{ height: props.height }}>
      <h2>Propozycje działań</h2>
      <Box display="flex" p={2}>
        <Typography>Filtrowanie akcji:</Typography>
        <Select
          style={{ width: '100%' }}
          value={selectedProposalState.value}
          onChange={(e: SelectChangeEvent) => handleFilterActions(e.target.value as string)}
          MenuProps={MenuProps}
        >
          {proposalsList.map((proposal) => (
            <MenuItem
              key={proposal.value}
              value={proposal.value}
            >
              {proposal.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {renderCorrectProposalTable()}
    </main>
  );
}

export default Proposals;
