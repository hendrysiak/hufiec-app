import { Box, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from "@mui/material";
import { FoundingSources, IncomeCategory, OutcomeCategory } from "models/global.enum";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";

const TeamFinance = ({ team }: { team: string }) => {
    const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
    const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

    const incomes = useMemo(() => dbIncomes.filter((income) => income.team === `${team}`), [dbIncomes, team]);
    const outcomes = useMemo(() => dbOutcomes.filter((outcome) => outcome.team === `${team}`), [dbOutcomes, team]);
    const teamAccountState = useSelector((state: RootState) => state.income.teamAccounts)?.[team] ?? 0;

    const onePercentState = React.useMemo(() => incomes.filter((income) => income.incomeCategory === IncomeCategory.OnePercent).reduce((acc, curr) => acc + curr.cash, 0), [team]);
    const onePercentOutcomes = React.useMemo(() => outcomes.filter((outcome) => outcome.foundingSource === FoundingSources.OneProcent).reduce((acc, curr) => acc + curr.cash, 0), [team]);
    const publicCollectionsState = React.useMemo(() => incomes.filter((income) => income.incomeCategory === IncomeCategory.PublicCollection).reduce((acc, curr) => acc + curr.cash, 0), [team]);
    const publicCollectionsOutcome = React.useMemo(() => outcomes.filter((outcome) => outcome.foundingSource === FoundingSources.PublicCollection).reduce((acc, curr) => acc + curr.cash, 0), [team]);

    const teamAccountOutcome = React.useMemo(() => outcomes.filter((outcome) => outcome.foundingSource === FoundingSources.OwnResources).reduce((acc, curr) => acc + curr.cash, 0), [team]);



    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: 'rgba(54, 33, 94, 1)',
            color: theme.palette.common.white,
            fontSize: 24,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 24,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
            fontSize: 24,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


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
            name: "Stan konta drużyny na dzień 31.12.2023 (w tym kwota zebrana ze składek)",
            cash: teamAccountState,
        },
        {
            name: "Wydatki drużyny",
            cash: teamAccountOutcome,
        }
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
                            {teamAccountState - teamAccountOutcome}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )


};

export default TeamFinance;
