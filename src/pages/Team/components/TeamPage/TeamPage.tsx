import Modal from '@material-ui/core/Modal';
import AssignmentIcon from '@material-ui/icons/Assignment';
import React, { useEffect, useState } from 'react';

import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'pages/Team/helpers/member-fee.helper';

import { ListOfMembers } from '../ListOfMembers/ListOfMembers';

import classes from './TeamPage.module.css';
import { ShowModal } from 'pages/Team/helpers/typeViewModal.enum';

interface IRows extends APIPerson {
  lp: string | number;
  fee: number;
  isDeleted: string
}

interface IProps {
  open: string;
  members: APIPerson[];
}

const TeamPage = ({ members, open } : IProps): JSX.Element => {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = useState<IRows[]>([]);
  // const columns = [
  //   { field: 'lp', headerName: 'LP', width: 80, cellClassName: `${classes.positionModalCell}` },
  //   { field: 'name', headerName: 'Imię', width: 150, cellClassName: `${classes.positionModalCell}` },
  //   { field: 'surname', headerName: 'Nazwisko', width: 150, cellClassName: `${classes.positionModalCell}` },
  //   { field: 'fee', headerName: 'Stan składek', width: 150, cellClassName: `${classes.positionModalCell}` },
  //   { field: 'isDeleted', headerName: 'Usunięty/-a?', width: 120, cellClassName: `${classes.positionModalCell}` }
  // ];

  useEffect(() => {
    open === ShowModal.Team && setOpen(true);
  },[open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const rows = members ? (members.map((el, index) => {
      return ({
        ...el,
        lp: index + 1,
        fee: countingMemberFee(el),
        isDeleted: el.dateOfDelete ? 'Tak' : 'Nie'
      });
    })) : ([]);
    setRows(rows);
  },[members]);


  return (
    <>
      <AssignmentIcon onClick={handleOpen}/>
      <Modal
        className={classes.modal}
        open={isOpen}
        onClose={handleClose}
      >
        <ListOfMembers rows={rows}/>  
      </Modal>
    </>
  );
};

export default TeamPage;