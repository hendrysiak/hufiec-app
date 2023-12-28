import { Box, Container, Grid, MenuItem, Tab, Tabs, TextField } from "@mui/material";
import TeamAccountList from "components/TeamAccountList/TeamAccountList";
import TeamFinance from "components/TeamFinance/TeamFinance";
import { useEntriesEdit } from "helpers/hooks/useEntriesEdit";
import { useTeams } from "helpers/hooks/useTeams";
import BudgetDataGrid from "pages/Edit/BudgetDataGrid";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store/models/rootstate.model";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const Account = () => {
    const [choosenTeam, setChoosenTeam] = React.useState('');
    const [currentTab, setCurrentTab] = React.useState(0);
    const teamsMap = useTeams();

    const dbIncomes = useSelector((state: RootState) => state.income.dbIncomes);
    const dbOutcomes = useSelector((state: RootState) => state.income.dbOutcomes);

    const { editedData, editedDataHandler, addNewPosition, handleCellEditCommit, handleDeleteBudgetEntry } = useEntriesEdit();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Container maxWidth={false}>
            <h2>Menadżer kont drużyn</h2>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleChange} variant="fullWidth">
                    <Tab label="Stany kont drużyn" />
                    <Tab label="Szczegóły" />
                </Tabs>
            </Box>
            <CustomTabPanel value={currentTab} index={0}>
                <Box>
                    <TextField
                        select
                        label="Wybierz drużynę"
                        value={choosenTeam}
                        onChange={(e) => setChoosenTeam(e.target.value)}
                        helperText="Wybierz drużynę, której konto chcesz edytować"
                    >
                        {teamsMap.map((option) => (
                            <MenuItem key={option.teamId} value={option.teamId}>
                                {option.teamId} {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        {choosenTeam === ""
                            ? <p>Wybierz drużynę</p>
                            : <><TextField
                                label="Co edytujesz?"
                                value={editedData === 'income' ? 'Przychody' : 'Koszty'}
                                onChange={(e) => editedDataHandler(e.target.value)}
                                placeholder="Wybierz kod z listy"
                                select
                                size="small"
                                variant="outlined"
                                margin="normal"
                                SelectProps={{
                                    MenuProps: { disableScrollLock: true },
                                }}
                            >
                                {['Przychody', 'Koszty'].map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </TextField>
                                <Box height="80vh">
                                    <BudgetDataGrid
                                        editedData={editedData}
                                        displayedIncome={dbIncomes.reverse().filter((income) => income.team === `${choosenTeam}`)}
                                        displayedOutcome={dbOutcomes.reverse().filter((outcome) => outcome.team === `${choosenTeam}`)}
                                        handleCellEditCommit={handleCellEditCommit}
                                        handleDeleteBudgetEntry={handleDeleteBudgetEntry}
                                    />
                                </Box></>}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box height="80vh">
                            {choosenTeam ? <TeamFinance team={choosenTeam} /> : <></>}
                        </Box>
                    </Grid>
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={currentTab} index={1}>
                <TeamAccountList />
            </CustomTabPanel>
        </Container>
    );
};

export default Account;