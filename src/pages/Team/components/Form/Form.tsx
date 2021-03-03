import { Button, MenuItem, TextField } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import MailIcon from '@material-ui/icons/Mail';

import React, { useEffect, useState } from 'react';

import axios from 'axios-income';

import classes from './Form.module.css';

const Form = ({open, title, currentTeam }: {open: string; title: string; currentTeam: string }): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messageTitle, setMessageTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [mail, setMail] = useState<string>('');


  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const sendHandler = async () => {
    setIsOpen(false);
    await axios.post('/ticket.json', { title: messageTitle, content, mail, team: currentTeam });
    setMessageTitle('');
    setContent('');
    setMail('');
  };

  useEffect(() => {
    open === 'form' && setIsOpen(true);
  },[open]);

  const topics = [
    'Błąd w przelewie - aplikacja źle zczytała przelew',
    'Błąd w aplikacji - coś nie działa prawidłowo',
    'Wyjaśnienie przelewu - nie rozumiem wprowadzonej pozycji',
    'Zmiana stanu drużyny - chcę dodać lub usunąć członków jednostki',
    'Stan konta - chcę wyjaśnień dotyczacych stanu konta'
  ];

  return (
    <>
      <MailIcon onClick={ handleOpen } />
      <Modal
        open={ isOpen }
        onClose={ handleClose }
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <form className={ classes.positionModal }>
          <h1 className={ classes.titleForm }>{title}</h1>
          <TextField 
            style={{ width: '80%' }}
            classes={{ root: classes.topic }}
            id="standard-basic" 
            label="WPISZ TEMAT" 
            value={messageTitle}
            onChange={(e) => setMessageTitle(e.target.value)}
            required
            select
            SelectProps={{
              MenuProps: { disableScrollLock: true }
            }}
          >
            {topics.map((item) => (
              <MenuItem classes={{ root: classes.menuItem }} key={item} value={item}>{item}</MenuItem>
            ))}
          </TextField>
          <TextField
            style={{ width: '80%' }}
            classes={{ root: classes.textArea }}
            fullWidth
            id="standard-multiline-static"
            label="WPISZ WIADOMOŚĆ"
            multiline
            rows={10}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <TextField 
            style={{ width: '80%' }}
            classes={{ root: classes.responseRoot }}
            className={classes.responseInput}
            id="standard-basic" 
            label="JEŚLI CHCESZ ODPOWIEDŹ, WPISZ MAILA" 
            value={mail}
            size="small"
            onChange={(e) => setMail(e.target.value)}
          />
          <Button style={{ margin: '10px 0 10px 0' }} variant="contained" color="primary" onClick={() => sendHandler()}>WYŚLIJ</Button>
        </form>
      </Modal>
    </>
  );
};  

export default Form;