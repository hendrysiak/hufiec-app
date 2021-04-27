import { Button, MenuItem, Modal, TextField } from '@material-ui/core';
import React, { useState} from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/models/rootstate.model';

import styles from '../EditorTeam.module.css';

import NewTeamMember from './NewTeamMember';

export const teamContext = React.createContext<string>('');

interface SelectTeam {
  children?: React.ReactNode;
  team: string; 
  onChange: (e: string) => void;
  disabled?: boolean;
}

const SelectTeam = ({onChange, team, disabled = false}: SelectTeam): JSX.Element => {
  const registry = useSelector((state: RootState) => state.income.registry);
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
        select={true}
        size="small"
        variant="outlined"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
        disabled={disabled}
      >
        {registry && ['Cały hufiec', ...Object.keys(registry)].map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </TextField>
      <Button className={styles.button} variant="contained" color="primary" onClick={handleOpenNewMember} disabled={team ? false : true}>
            NOWY CZŁONEK
      </Button>
      <Modal
        open={openNewMember}
        onClose={handleCloseNewMember}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <NewTeamMember team={team} handleCloseNewMember={handleCloseNewMember}/>
      </Modal>
    </div>
  );
};

export default SelectTeam;