import {
  Button, MenuItem, Modal, TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useTeams } from 'helpers/hooks/useTeams';
import styles from '../../pages/EditorTeam/EditorTeam.module.css';
import NewTeamMember from '../NewTeamMember/NewTeamMember';

export const teamContext = React.createContext<string>('');

interface SelectTeam {
  children?: React.ReactNode;
  team: number;
  onChange: (e: string) => void;
  disabled?: boolean;
}

function SelectTeam({ onChange, team, disabled = false }: SelectTeam): JSX.Element {
  const teams = useTeams();

  const [openNewMember, setOpenNewMember] = useState<boolean>(false);

  const handleOpenNewMember = () => {
    setOpenNewMember(true);
  };
  const handleCloseNewMember = () => {
    setOpenNewMember(false);
  };

  return (
    <div className={styles.div}>
      <TextField
        style={{ width: '200px', margin: '0 8px' }}
        label="Wybierz drużynę"
        value={team}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Wybierz drużynę z listy"
        select
        size="small"
        variant="outlined"
        SelectProps={{
          MenuProps: { disableScrollLock: true },
        }}
        disabled={disabled}
      >
        <MenuItem key={'Cały hufiec'} value={'Cały hufiec'}>{'Cały hufiec'}</MenuItem>
        <MenuItem key={'Instruktorzy'} value={'Instruktorzy'}>{'Instruktorzy'}</MenuItem>
        {(teams || []).map((t) => (
          <MenuItem key={t.teamId} value={t.teamId}>{`${t.teamId} ${t.name}`}</MenuItem>
        ))}
      </TextField>
      <Button className={styles.button} variant="contained" color="primary" onClick={handleOpenNewMember} disabled={!team}>
        NOWY CZŁONEK
      </Button>
      <Modal
        open={openNewMember}
        onClose={handleCloseNewMember}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <NewTeamMember team={team} handleCloseNewMember={handleCloseNewMember} />
      </Modal>
    </div>
  );
}

export default SelectTeam;
