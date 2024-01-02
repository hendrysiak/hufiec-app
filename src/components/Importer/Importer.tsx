import { Box, Button, Grid, Modal, Paper } from "@mui/material";
import ModalImportPersonAccountState from "components/ModalImportPersonAccountState/ModalImportPersonAccountState";
import ModalImportTeamAccountState from "components/ModalImportTeamAccountState/ModalImportTeamAccountState";
import { useState } from "react";

const Importer = () => {
    const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
    const [openPersonAccountModal, setOpenPersonAccountModal] = useState<boolean>(false);

    return (<Paper elevation={3}>
        <Box p={4}>
            <h2>Importer</h2>
            <p>Importuj stany kont drużyn oraz osób</p>
            <Box mt={4}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button onClick={() => setOpenAccountModal(true)} variant="contained" color="primary">Importuj stany kont drużyn</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={() => setOpenPersonAccountModal(true)} variant="contained" color="primary">Importuj stany kont osób</Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
        <ModalImportPersonAccountState open={openPersonAccountModal} setOpen={setOpenPersonAccountModal} />
        <ModalImportTeamAccountState open={openAccountModal} setOpen={setOpenAccountModal} />
    </Paper>)
};

export default Importer;