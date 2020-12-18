import Modal from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import React, {useEffect, useState} from 'react';
import './style.css';

interface IMember {
  id: number | string; 
  lp: number | string; 
  name: string;
  surname: string;
}
interface Props {
  members: IMember[];
  icon: string;
}

const TeamPage = ({ members, icon } : Props): JSX.Element => {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [rows, setRows] = useState<IMember[] | []>([]);
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
    const helper: IMember[] = members ? (members.map((el: IMember, index: number) => {
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
      <button type="button" onClick={handleOpen}>
        {icon}
      </button>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={{ height: 670, width: 500, backgroundColor: 'white' }}>
          {rows.length ? (
            <DataGrid rows={rows} columns={columns} pageSize={10} checkboxSelection />
          ) : (
            <div className="loadingInfo">wczytywanie drużyny</div>
          )
          }
        </div>
      </Modal>
    </>
  );
};

export default TeamPage;