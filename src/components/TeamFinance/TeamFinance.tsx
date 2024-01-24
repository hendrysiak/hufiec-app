import { Box, Divider, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "helpers/render/StyledTableElements";
import { getAccountStateForTeam } from "helpers/utils/getAccountStateForTeam";
import React from "react";

const TeamFinance = ({ team }: { team: string }) => {

    const { 
        onePercentOutcomes, 
        onePercentState, 
        publicCollectionsOutcome, 
        publicCollectionsState, 
        sumOfFeesForTeam, 
        sumOfNeededFees, 
        teamAccountOutcome, 
        teamAccountState 
    } = React.useMemo(() => getAccountStateForTeam(team), [team]);


    const rows = [
        {
            name: "Kwota zebrana 1,5%",
            cash: onePercentState,
        },
        {
            name: "Wydatki 1,5%",
            cash: onePercentOutcomes,
        },
        {
            name: "Kwota zebrana w ramach zbiórki publicznej",
            cash: publicCollectionsState,
        },
        {
            name: "Wydatki zbiórek publicznych",
            cash: publicCollectionsOutcome,
        },
        {
            name: "Stan konta drużyny na dzień 31.12.2023",
            cash: teamAccountState,
        },
        {
            name: "Kwota zebrana ze składek",
            cash: (sumOfFeesForTeam ? sumOfFeesForTeam : 0).toFixed(2),
        },
        {
            name: "Niezebrane składki - suma minusów",
            cash: sumOfNeededFees.toFixed(2),
        },
        {
            name: "Wydatki drużyny",
            cash: teamAccountOutcome,
        },
    ]

    return (
        <Box pt={8}>
            <Paper elevation={3}>
                <TableContainer>
                    <Table sx={{ minWidth: 500 }} aria-label="team account">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Kategoria</StyledTableCell>
                                <StyledTableCell align="center">Kwota</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell align="center" component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{row.cash}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider />
                <Box px={2} py={4}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h5" component="p" >
                            Do wydania 1,5%
                        </Typography>
                        <Typography variant="h5" component="p" minWidth="150px">
                            {onePercentState - onePercentOutcomes}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h5" component="p" >
                            Do wydania ze zbiórek
                        </Typography>
                        <Typography variant="h5" component="p" minWidth="150px">
                            {publicCollectionsState - publicCollectionsOutcome}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant="h5" component="p" >
                            Do wydania ze środków drużyny
                        </Typography>
                        <Typography variant="h5" component="p" minWidth="150px">
                            {teamAccountState + Number((sumOfFeesForTeam ? sumOfFeesForTeam : 0).toFixed(2)) - teamAccountOutcome }
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )


};

export default TeamFinance;
