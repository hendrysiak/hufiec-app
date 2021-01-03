import { Button, TextField } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import MailIcon from '@material-ui/icons/Mail';
import React, { useState } from 'react';

import classes from './Form.module.css';

const Form = ({title }: {title: string }): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <MailIcon onClick={handleOpen} style={{fontSize: 26, color: 'white', cursor: 'pointer'}}/>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>
          <form className={classes.positionModal}>
            <h1>{title}</h1>
            {/* <label className={classes.label} htmlFor="input"><input className={classes.input} id="input" type="text" placeholder="WPISZ TEMAT"/></label> */}
            {/* <textarea className={classes.textarea} name="report" cols={30} rows={10} placeholder="WPISZ TREŚĆ ZGŁOSZENIA"></textarea> */}
            {/* <TextField
              id="standard-multiline-flexible"
              label="Multiline"
              multiline
              rowsMax={4}
            />
            <TextField
              id="standard-textarea"
              label="Multiline Placeholder"
              placeholder="Placeholder"
              multiline
            /> */}
            <TextField style={{width: '80%'}} id="standard-basic" label="WPISZ TEMAT" required />
            <TextField
              style={{width: '80%'}}
              fullWidth
              id="standard-multiline-static"
              label="WPISZ WIADOMOŚĆ"
              multiline
              rows={10}
              required
              // defaultValue="Default Value"
            />
            <Button style={{margin: '10px 0 10px 0'}} variant="contained" color="primary">WYŚLIJ</Button>
            {/* <button className={classes.button}>Wyślij</button> */}
          </form>
        </>
      </Modal>
    </>
  );
};  

export default Form;