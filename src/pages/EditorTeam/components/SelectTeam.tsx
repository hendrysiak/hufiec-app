import { Button, MenuItem, Modal, TextField } from '@material-ui/core';
import React, { useState, FC, useContext, PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/models/rootstate.model';

import styles from '../EditorTeam.module.css';

import NewTeamMember from './NewTeamMember';

export const teamContext = React.createContext<string>('');

interface SelectTeam {
  children?: React.ReactNode;
  team: string; 
  onChange: (e: string) => void;
}

const SelectTeam = ({onChange, team}: SelectTeam) => {
  // const [stateTeam, setTeam] = useState<string>('');
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
        style={{ marginTop: '16px', width: '200px' }}
        label="Wybierz drużynę"
        value={team}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Wybierz drużynę z listy"
        select={true}
        size="small"
        variant="outlined"
        margin="normal"
        SelectProps={{
          MenuProps: { disableScrollLock: true }
        }}
      >
        {registry && ['', ...Object.keys(registry)].map((item) => (
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
        <NewTeamMember team={team}/>
      </Modal>
    </div>
  );
};

export default SelectTeam;