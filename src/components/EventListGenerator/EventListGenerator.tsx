import { Box, Button, Paper } from "@mui/material";
import ModalEventListGenerator from "components/ModalEventListGenerator/ModalEventListGenerator";
import { useState } from "react";

const EventListGenerator = () => {

  const [open, setOpen] = useState<boolean>(false);


  return (<Paper elevation={3}>
    <Box p={4}>
      <h2>Generator listy osób na wydarzenie</h2>
      <Box pt={3.5} pb={3.5}>
        <p>Dzięki temu pobierzesz listę odpłatności wraz ze stanem składek</p>
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Otwórz generator</Button>
      </Box>
    </Box>
    {open && <ModalEventListGenerator open={open} setOpen={setOpen} />}
  </Paper>)
};

export default EventListGenerator;