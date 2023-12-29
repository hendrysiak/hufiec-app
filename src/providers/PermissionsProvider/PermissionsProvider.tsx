import React from 'react';

import { useHistory, useLocation } from 'react-router-dom';

import { useUserData } from 'helpers/hooks/useUserData';
import {
  getInitAccountState, getAccountState, getRegistry, getImportDates, getCodes,
} from 'helpers/api-helpers/account.handler';
import { reduxSetRoles, reduxIsAuthentication, reduxSetTeam } from 'store/actions';
import { reduxSetEvidenceNumber } from 'store/actions/user';
import store from 'store/store';

import { useAuth } from '../AuthUserProvider/AuthUserProvider';
import { Typography, Button, Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { blue } from '@mui/material/colors';
import GroupsIcon from '@mui/icons-material/Groups';
import { getAccountsStates } from 'helpers/api-helpers/account';

const downloadData = async (team: number) => {
  await getInitAccountState();
  await getAccountState();
  await getCodes(team);
  await getRegistry();
  await getImportDates();
  await getAccountsStates();
};

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  teams: string[];
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, teams } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Wybierz drużynę z listy</DialogTitle>
      <List sx={{ pt: 0 }}>
        {teams.map((team) => (
          <ListItem disableGutters key={team}>
            <ListItemButton onClick={() => handleListItemClick(team)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <GroupsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={team} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default function ChooseTeamDialog({
  teams,
  open,
  setOpen,
  selectedValue,
  setSelectedValue
}: {
  teams: string[],
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedValue: string,
  setSelectedValue: (team: string) => void
}) {

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        teams={teams}
      />
    </div>
  );
}

export function PermissionsProvider({ children }: { children: React.ReactElement }) {
  const { authUser } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [team, setTeam] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);

  const user = useUserData(authUser?.uid);

  const handleSelectTeam = (newTeam: string) => {
    setTeam(Number(newTeam));
  }

  // THere we want to provide check function to make sure that the user with correct role has access to correct data

  React.useEffect(() => {
    if (user) {
      const currentUrl = location.pathname;

      if (user?.team) {
        if (currentUrl !== '/') {
          const potentialTeam = history.location.pathname.slice(1);
          if (user?.team.includes(potentialTeam)) {
            return setTeam(Number(potentialTeam));
          }
        }

        if (!team) {
          if (user?.team.length > 1) {
            setOpen(true)
          } else {
            setTeam(Number(user.team[0]));
          }
        }
      }


      if (user?.role === 'admin' && location.pathname === '/') {
        history?.push('/dashboard');
      }
    }

    if (!user) {
      history?.push('/');
    }
  }, [location.pathname, user]);

  React.useEffect(() => {
    history?.push(`/${team}`)
  }, [team]);

  React.useEffect(() => {
    if (user) {
      store.dispatch(reduxSetRoles([user.role]));
      store.dispatch(reduxIsAuthentication(true));
      store.dispatch(reduxSetEvidenceNumber(user.evidenceNumber ?? ''));
      store.dispatch(reduxSetTeam(team ?? 1111));
      downloadData(team ?? 1111);
    }
  }, [user, team]);

  return (<>
    {children}
    <ChooseTeamDialog
      teams={user?.team ?? []}
      open={open}
      setOpen={setOpen}
      selectedValue={`${team}` ?? '1111'}
      setSelectedValue={handleSelectTeam}
    />
  </>);
}
