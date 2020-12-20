import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import AssignmentIcon from '@material-ui/icons/Assignment';
import React, { useEffect, useState} from 'react';


import { Person } from 'models/registry.models';

import classes from './TeamPage.module.css';

interface Rows extends Person {
  id?: string | number;
  lp?: string | number;
}

interface Props {
  members: Rows[];
}

const TeamPage = ({ members } : Props): JSX.Element => {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = useState<any>([]);
  const columns = [
    { field: 'lp', headerName: 'LP', width: 80, },
    { field: 'name', headerName: 'First name', width: 150 },
    { field: 'surname', headerName: 'Surname', width: 150 }
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const helper = members ? (members.map((el, index) => {
      return ({
        ...el,
        lp: index + 1,
        id: index,
      });
    })) : ([]);
    setRows(helper);
  },[members]);


  return (
    <>
      <AssignmentIcon onClick={handleOpen} style={{fontSize: 26, color: 'white', cursor: 'pointer'}}/>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.positionModal} style={{ height: 670, width: 500, backgroundColor: 'white' }}>
          {rows.length ? (
            <DataGrid rows={rows} columns={columns} pageSize={10} />
          ) : (
            <div>wczytywanie drużyny</div>
          )
          }
        </div>
      </Modal>
    </>
  );
};

export default TeamPage;