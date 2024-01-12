import { Box, Button, Grid, Modal, Paper } from "@mui/material";
import ModalMapInitAccountToRegistry from "components/ModalMapInitAccountToRegistry/ModalMapInitAccountToRegistry";
import { getPlainRegistry } from "helpers/api-helpers/account.handler";
import { deleteAllOutcomes, deleteIncomesByCode } from "helpers/editing-db.handler";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";

const AdminActions = () => {

    const [open, setOpen] = useState<boolean>(false);

    const clearAccounts = async () => {
        if (window.confirm('Czy na pewno chcesz wyczyścić konta?')) {
          await deleteIncomesByCode('SC');
          await deleteAllOutcomes();
        }
      }

    return (<Paper elevation={3}>
        <Box p={4}>
              <h2>Czyszczenie składek</h2>
              <Box pt={3.5} pb={3.5}>
                <Button variant="contained" color="secondary" onClick={clearAccounts}>Wyczyść konta</Button>
              </Box>
            <Box p={4}>
                <h2>Dopisz numery ewidencji</h2>
                <p>Dzięki temu dopiszesz numery ewidencji z kolekcji stanu początkowego</p>
                <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>Otwórz mapper</Button>
            </Box>
        </Box>
        <ModalMapInitAccountToRegistry open={open} setOpen={setOpen} />
    </Paper>)
};

export default AdminActions;