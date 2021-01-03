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
            <label className={classes.label} htmlFor="input"><input className={classes.input} id="input" type="text" placeholder="WPISZ TEMAT"/></label>
            <textarea className={classes.textarea} name="report" cols={30} rows={10} placeholder="WPISZ TREŚĆ ZGŁOSZENIA"></textarea>
            <button className={classes.button}>Wyślij</button>
          </form>
        </>
      </Modal>
    </>
  );
};  

export default Form;