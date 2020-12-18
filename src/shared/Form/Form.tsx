import Modal from '@material-ui/core/Modal';
import './style.css';
import React, { useState } from 'react';


const Form = ({title, icon}: {title: string, icon: string}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

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
        <>
          <form className="errorReport">
            <h1>{title}</h1>
            <label htmlFor="input"><input id="input" type="text" placeholder="WPISZ TEMAT"/></label>
            <textarea name="report" cols={30} rows={10} placeholder="WPISZ TREŚĆ ZGŁOSZENIA"></textarea>
            <button>Wyślij</button>
          </form>
        </>
      </Modal>
    </>
  );
};  

export default Form;