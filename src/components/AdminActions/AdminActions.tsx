import { Box, Button, Grid, Modal, Paper } from "@mui/material";
import ModalMapInitAccountToRegistry from "components/ModalMapInitAccountToRegistry/ModalMapInitAccountToRegistry";
import ModalTipiImport from "components/ModalTipiImport/ModalTipiImport";
import { getPlainRegistry } from "helpers/api-helpers/account.handler";
import {
  deleteAllOutcomes,
  deleteIncomesByCode,
} from "helpers/editing-db.handler";
import { useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";

const AdminActions = () => {
  const [mapperModalOpen, setMapperModalOpen] = useState<boolean>(false);
  const [tipiModalOpen, setTipiModalOpen] = useState<boolean>(false);

  const clearAccounts = async () => {
    if (window.confirm("Czy na pewno chcesz wyczyścić konta?")) {
      await deleteIncomesByCode("SC");
      await deleteAllOutcomes();
    }
  };

  return (
    <Paper elevation={3}>
      <Box p={4}>
        <h2>Czyszczenie składek</h2>
        <Box pt={3.5} pb={3.5}>
          <p>
            Dzięki temu wyczyścisz nieaktualne przelewy, dotyczące składek
            (usunie też koszty)
          </p>
        </Box>
        <Button variant="contained" color="secondary" onClick={clearAccounts}>
          Wyczyść konta
        </Button>
        <Box p={4}>
          <h2>Dopisz numery ewidencji</h2>
          <Box pt={3.5} pb={3.5}>
            <p>
              Dzięki temu dopiszesz numery ewidencji z kolekcji stanu
              początkowego
            </p>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setMapperModalOpen(true)}
          >
            Otwórz mapper
          </Button>
        </Box>
        <Box p={4}>
          <h2>Zaimportuj dane z Tipi</h2>
          <Box pt={3.5} pb={3.5}>
            <p>
              Dzięki temu zaktualizujesz bazę danych aplikacji o dane z
              ewidencji
            </p>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setTipiModalOpen(true)}
          >
            Otwórz importer
          </Button>
        </Box>
      </Box>
      {mapperModalOpen && (
        <ModalMapInitAccountToRegistry
          open={mapperModalOpen}
          setOpen={setMapperModalOpen}
        />
      )}
      {tipiModalOpen && (
        <ModalTipiImport open={tipiModalOpen} setOpen={setTipiModalOpen} />
      )}
    </Paper>
  );
};

export default AdminActions;
