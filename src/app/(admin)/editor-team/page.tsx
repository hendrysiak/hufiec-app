"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import DoneIcon from "@mui/icons-material/DoneAllTwoTone";
import EditIcon from "@mui/icons-material/EditOutlined";
import RevertIcon from "@mui/icons-material/NotInterestedOutlined";
import {
  Box,
  MenuItem,
  TablePagination,
  TextField,
  Tab,
  Tabs,
  Table,
  TableCell,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import { CustomTable as Table } from '../../../helpers/stylesTable';
import TableBody from "@mui/material/TableBody";
// import { CustomTableCell as TableCell } from '../../../helpers/stylesTable';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { DesktopDatePicker } from "@mui/x-date-pickers";
import React, { useState, useEffect } from "react";

import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";

import { useTeams } from "helpers/hooks/useTeams";
import { sortOfSurname } from "helpers/sorting.helper";
import { Rows } from "models/global.enum";
import { APIPerson } from "models/registry.models";
import TeamFinances from "components/TeamFinances/TeamFinances";
import { countAmountOfFee, countingMemberFee } from "helpers/member-fee.helper";
import { FiltersName } from "shared/TableEditor/FiltersName";
import { TabPanel } from "shared/TabPanel/TabPanel";
import { RootState } from "store/models/rootstate.model";

import { editTeamMember } from "../../../helpers/editing-db.handler";

import {
  controlerDate,
  filterMembers,
  handleDelete,
  handleRestore,
} from "../../../helpers/registry.helper";
import SelectTeam from "../../../components/SelectTeam/SelectTeam";
import { InitAccountState } from "models/income.models";
import { CustomTableCell } from "../../../components/NewCell/NewCell";
import { useGlobalSettings } from "helpers/hooks/useGlobalSettings";

export interface IPerson extends APIPerson {
  lp?: number;
}

interface EditorTeamProps {
  isAdmin?: boolean;
}

const getInitAccountState = (
  person: APIPerson,
  initAccount: InitAccountState[]
) => {
  return (
    initAccount.find(
      (p) => p.name === person.name && p.surname === person.surname
    )?.balance ?? 0
  );
};

function EditorTeam({ isAdmin = false }: EditorTeamProps): JSX.Element {
  const registry = useSelector((state: RootState) => state.income.registry);
  const initAccount = useSelector(
    (state: RootState) => state.income.initAccount
  );

  const teams = useTeams();

  const [rows, setRows] = useState<(IPerson & { feeState: number })[]>([]);
  const [team, setTeam] = useState<string>("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");

  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [newData, setNewData] = useState<Partial<APIPerson> | null>(null);

  const { globalSettings } = useGlobalSettings();

  const clearStateRow = () => {
    setActiveRow(null);
    setNewData(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onToggleEditMode = (id: string) => {
    if (
      activeRow &&
      !window.confirm(
        "Jesteś w trakcie edycji innej osoby. Naciśnij okej, a usuniesz wszelkie wprowadzone zmiany."
      )
    ) {
      return;
    }
    setNewData(null);
    setActiveRow(id);
    setNewData((prev) => ({
      ...prev,
      id,
      team: Number(team),
    }));
  };

  const handleAcceptChange = async (id: string) => {
    if (!newData || !window.confirm("Na pewno zapisać zmiany?")) return;

    try {
      await editTeamMember(Number(team), newData);
      alert("Edycja zakończona sukcesem.");
      clearStateRow();
      return;
    } catch (err) {
      alert("Wystąpił błąd podczas edycji. Spróbuj ponownie.");
    }
    onToggleEditMode(id);
  };

  const onChange = (e: {
    target: { value: string | boolean; name: string };
  }) => {
    const { value, name: newName } = e.target;

    console.log(newName, value);

    setNewData((prev) => ({
      ...prev,
      [newName]: value,
    }));
  };

  const onRevert = () => {
    if (!window.confirm("jesteś pewien, że chcesz cofnąć zmiany?")) return;
    clearStateRow();
  };

  const handleChangeSelect = (value: string) => {
    if (
      activeRow &&
      !window.confirm(
        "Jestes w trakcie edycji, jestes pewien, że chcesz zakończyć bez zapisywania zmian?"
      )
    ) {
      return;
    }
    clearStateRow();
    setTeam(value);
  };

  useEffect(() => {
    let usedRegistry: APIPerson[] = [];

    if (team === "Cały hufiec") {
      for (const currentTeam in registry) {
        usedRegistry = [
          ...usedRegistry,
          ...Object.values(registry[currentTeam]),
        ];
      }
    } else if (team === "Instruktorzy") {
      for (const currentTeam in registry) {
        usedRegistry = [
          ...usedRegistry,
          ...Object.values(registry[currentTeam]),
        ].filter((person) => person.instructor);
      }
    } else
      usedRegistry = registry[team] ? [...Object.values(registry[team])] : [];

    if (usedRegistry) {
      sortOfSurname(usedRegistry, "ŻŻŻ");
    }
    const rows = usedRegistry
      ? filterMembers(
          usedRegistry,
          { name, surname },
          globalSettings?.endOfPeriodToCalc
        )
      : [];
    setRows(rows);
  }, [team, registry, name, surname]);

  const handleDateChange = (e: Date | null, row: IPerson, nameKey: string) => {
    const value = e;
    if (!value) return;

    if (controlerDate(value, newData, row, nameKey)) {
      alert(
        "Data usunięcia członka nie może być wcześniej niż data dodania go do drużyny."
      );
      return;
    }

    setNewData((prev) => ({
      ...prev,
      [nameKey]: value,
    }));
  };

  if (globalSettings?.isMaintenanceMode) {
    return <p>W trakcie przerwy technicznej</p>;
  }

  return (
    <>
      <Grid container p={4} gap={1}>
        <Grid item xs={12} md={5}>
          <FiltersName
            name={name}
            setName={setName}
            surname={surname}
            setSurname={setSurname}
          />
        </Grid>
        <Grid item xs={12} md={3.5}>
          <SelectTeam
            onChange={handleChangeSelect}
            team={Number(team)}
            disabled={!!activeRow}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <CSVLink
            data={rows}
            filename={`${team}.csv`}
            style={{ margin: "0 8px" }}
          >
            <Button variant="contained" color="primary">
              Pobierz stan składek
            </Button>
          </CSVLink>
        </Grid>
      </Grid>

      <Table aria-label="caption table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Edytuj</TableCell>
            <TableCell align="left">LP</TableCell>
            {team === "Cały hufiec" && (
              <TableCell align="left">Drużyna</TableCell>
            )}
            <TableCell align="left">Nazwisko</TableCell>
            <TableCell align="left">Imię</TableCell>
            <TableCell align="left">Nr ewidencji</TableCell>
            <TableCell align="left">NS?</TableCell>
            <TableCell align="left">Instruktor?</TableCell>
            <TableCell align="left">Data dodania</TableCell>
            <TableCell align="left">Data usunięcia</TableCell>
            <TableCell align="left">Stan początkowy</TableCell>
            <TableCell align="left">Stan składek</TableCell>
            <TableCell align="left">Składki należne</TableCell>
            <TableCell align="left" />
            <TableCell align="left">Akcje</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {row.id === activeRow ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() => handleAcceptChange(row.id)}
                          size="large"
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={onRevert}
                          size="large"
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        onClick={() => onToggleEditMode(row.id)}
                        size="large"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <CustomTableCell
                    {...{
                      row,
                      name: Rows.Lp,
                      onChange,
                      id: activeRow,
                      newData,
                      notEditable: true,
                    }}
                  />
                  {team === "Cały hufiec" && (
                    <CustomTableCell
                      {...{
                        row,
                        name: Rows.Team,
                        onChange,
                        id: activeRow,
                        newData,
                      }}
                    />
                  )}
                  <CustomTableCell
                    {...{
                      row,
                      name: Rows.Surname,
                      onChange,
                      id: activeRow,
                      newData,
                    }}
                  />
                  <CustomTableCell
                    {...{
                      row,
                      name: Rows.Name,
                      onChange,
                      id: activeRow,
                      newData,
                    }}
                  />
                  <CustomTableCell
                    {...{
                      row,
                      name: Rows.EvidenceNumber,
                      onChange,
                      id: activeRow,
                      newData,
                    }}
                  />
                  <CustomTableCell
                    {...{
                      row,
                      name: Rows.Disability,
                      onChange,
                      id: activeRow,
                      newData,
                      useBoolean: true,
                    }}
                  />
                  <CustomTableCell
                    {...{
                      row,
                      name: Rows.Instructor,
                      onChange,
                      id: activeRow,
                      newData,
                      useBoolean: true,
                    }}
                  />
                  <TableCell>
                    <DesktopDatePicker
                      disabled={activeRow !== row.id}
                      key={row.id}
                      // label="Data dodania"
                      inputFormat="dd/MM/yyyy"
                      value={
                        newData?.dateOfAdd && activeRow === row.id
                          ? new Date(newData.dateOfAdd)
                          : row.dateOfAdd
                          ? new Date(row.dateOfAdd)
                          : null
                      }
                      onChange={(e) => handleDateChange(e, row, "dateOfAdd")}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </TableCell>
                  <TableCell>
                    <DesktopDatePicker
                      disabled={activeRow !== row.id}
                      key={row.id}
                      // label="Data usunięcia"
                      inputFormat="dd/MM/yyyy"
                      value={
                        newData?.dateOfDelete && activeRow === row.id
                          ? new Date(newData.dateOfDelete)
                          : row.dateOfDelete
                          ? new Date(row.dateOfDelete)
                          : null
                      }
                      onChange={(e) => handleDateChange(e, row, "dateOfDelete")}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </TableCell>
                  <TableCell>{getInitAccountState(row, initAccount)}</TableCell>
                  <TableCell>{row.feeState}</TableCell>
                  <TableCell>
                    {countAmountOfFee(row, globalSettings?.endOfPeriodToCalc)}
                  </TableCell>
                  {row.id === activeRow ? (
                    <TableCell>
                      <TextField
                        name={Rows.Team}
                        id="standard-select-currency"
                        select
                        label="Wybierz"
                        value={newData?.team}
                        onChange={(e) => onChange(e)}
                        helperText="Przenieś do innej drużyny"
                      >
                        {teams
                          ?.map((t) => t.teamId)
                          .map((team) => (
                            <MenuItem key={team} value={team}>
                              {team}
                            </MenuItem>
                          ))}
                      </TextField>
                    </TableCell>
                  ) : (
                    <TableCell />
                  )}
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      color={
                        row && Number(row.feeState) >= 0
                          ? "secondary"
                          : "primary"
                      }
                      onClick={() => handleDelete(rows, row.id, isAdmin)}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      aria-label="revert"
                      color={"primary"}
                      onClick={() => handleRestore(rows, row.id)}
                      size="large"
                    >
                      <RestoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Ilość wierszy na stronie"
        onPageChange={handleChangePage}
      />
      {/* <TabPanel value={tab} index={1}>
        {team ? <TeamFinances neededFee={sumOfNeededFees()} incomes={dbIncomes.filter((i) => i.team === `${team}`)} outcomes={dbOutcomes.filter((o) => o.team === `${team}`)} currentTeam={team} /> : <p>Wybierz drużynę</p>}
      </TabPanel> */}
    </>
  );
}

export default EditorTeam;
