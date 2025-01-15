"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserData } from "helpers/hooks/useUserData";
import {
  reduxSetRoles,
  reduxIsAuthentication,
  reduxSetTeam,
  reduxSetEvidenceNumber,
} from "store/actions";

import store from "store/store";

import { useAuth } from "../AuthUserProvider/AuthUserProvider";
import {
  Typography,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import GroupsIcon from "@mui/icons-material/Groups";
import { getAccountsStates } from "helpers/api-helpers/account";
import { useInitialData } from "helpers/hooks/useInitialData";

// const downloadData = async (team: number) => {
//   await getInitAccountState();
//   await getAccountState();
//   await getCodes(team);
//   await getRegistry();
//   await getImportDates();
//   await getAccountsStates();
// };

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
  setSelectedValue,
}: {
  teams: string[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue: string;
  setSelectedValue: (team: string) => void;
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

export function PermissionsProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useUserData(session?.user?.uid);
  const [team, setTeam] = useState<number | null>(null);
  const { downloadData } = useInitialData();

  useEffect(() => {
    if (!isLoading && user) {
      // Handle team selection
      if (user.role === "leader") {
        if (user.team.length === 1) {
          setTeam(Number(user.team[0]));
        } else if (user.team.length > 1) {
          const currentTeam = pathname.slice(1);
          if (user.team.includes(currentTeam)) {
            setTeam(Number(currentTeam));
          } else {
            setOpen(true);
          }
        }
      }

      // Set Redux state
      store.dispatch(reduxSetRoles([user.role]));
      store.dispatch(reduxIsAuthentication(true));
      store.dispatch(reduxSetEvidenceNumber(user.evidenceNumber ?? ""));
      downloadData(team); // Download data when team is set
      if (team) {
        store.dispatch(reduxSetTeam(team));
      }
    }
  }, [user, isLoading, pathname, team]);

  // Handle team changes
  useEffect(() => {
    if (team !== null) {
      router.push(`/${team}`);
    }
  }, [team]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <>
      {children}
      {user?.role === "leader" && user.team.length > 1 && (
        <ChooseTeamDialog
          teams={user.team}
          open={open}
          setOpen={setOpen}
          selectedValue={`${team}` ?? ""}
          setSelectedValue={(newTeam) => setTeam(Number(newTeam))}
        />
      )}
    </>
  );
}
