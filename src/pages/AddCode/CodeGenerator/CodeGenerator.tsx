import { Box, Button, Checkbox, Chip, FormControlLabel, ListItemText, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { RootState } from 'store/models/rootstate.model';

interface CodeGeneratorValues { 
  responsiblePerson: {
    name: string;
    surname: string;
  },
  amount: number;
  oneDay: boolean;
  startDate: Date;
  endDate: Date;
  wholeOrganization: boolean;
}

const codePattern = [
  { name: 'biwak', value: 'BK', useSuffix: true },
  { name: 'biwak szczepu', value: 'BS', useSuffix: true },
  { name: 'rajd', value: 'RD', useSuffix: true },
  { name: 'harcerski start', value: 'HS', useSuffix: false },
  { name: 'CMOK SONG', value: 'CMOK', useSuffix: false },
  { name: 'Odrzański Spływ Wiosenny', value: 'OSW', useSuffix: false },
  { name: 'Jesienny Spływ Wiślany', value: 'JSW', useSuffix: false },
  { name: 'obóz', value: 'OH', useSuffix: true },
  { name: 'przyjezdny obóz', value: 'HAL', useSuffix: true },
  { name: 'kurs drużynowych', value: 'KD', useSuffix: true },
  { name: 'kurs zastępowych', value: 'KZ', useSuffix: true },
  { name: 'kurs przewodnikowski', value: 'KP', useSuffix: true },
  { name: 'poligon', value: 'PL', useSuffix: true },
  { name: 'zlot chorągwi', value: 'ZC', useSuffix: true },
  { name: 'wyjazdowy festiwal', value: 'WF', useSuffix: true },
  { name: 'Betlejemskie Światło Pokoju', value: 'BSP', useSuffix: true },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface CodeGeneratorProps {
  isAdmin?: boolean;
  submitHandler?: () => void;
}

const CodeGenerator = (props: CodeGeneratorProps): JSX.Element => {
  const codesMap = useSelector((state: RootState) => state.income.codesMap);
  const registry = useSelector((state: RootState) => state.income.registry);
  const userIsAdmin = useSelector((state: RootState) => state?.user?.roles?.includes('admin'));

  const { control, watch, register, errors, setValue, handleSubmit } = useForm<CodeGeneratorValues>({
    defaultValues: {
      responsiblePerson: {
        name: '',
        surname: ''
      },
      amount: 0,
      oneDay: false,
      startDate: new Date(),
      endDate: new Date(),
      wholeOrganization: true,
    }
  });
  

  const [selectedCode, setSelectedCode] = React.useState(codePattern[0]);
  const [selectedTeams, setSelectedTeams] = React.useState<string[]>([]);

  const { pathname } = useLocation();

  React.useEffect(() => {
    !props.isAdmin && setSelectedTeams([pathname.slice(1)]);
  }, [props.isAdmin]);

  const handleSelectCode = (code: string) => {
    const foundedCode = codePattern.find(c => c.value === code);
    if (foundedCode) setSelectedCode(foundedCode);
  };

  const handleChange = (event: { target: { value: any; }; }) => {
    const {
      target: { value },
    } = event;
    setSelectedTeams(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const generateNextNumber = () => {
    if (!codesMap) return '';

    const currentCodePrefixAmount = Object.values(codesMap)
      .filter(code => code.prefix === selectedCode?.value)
      .length;

    if (currentCodePrefixAmount === 0) return selectedCode.useSuffix ? '-01' : '';
    // add code properties
    if (selectedCode.useSuffix) {
      return currentCodePrefixAmount > 9 ? `-${currentCodePrefixAmount + 1}` : `-0${currentCodePrefixAmount + 1}`;
    }
    return '';
  };


  return (
    <main>
      <h2>
        Generator kodów
      </h2>
      <Box>
        <Box>
          <Box display="flex" flexDirection="column" justifyContent="space-around" alignItems="center" p={4}>
            <Typography>Osoba odpowiedzialna:</Typography>
            <TextField
              style={{ width: '100%' }}
              label="Imię"
              value={watch('responsiblePerson.name')}
              inputRef={register({
                validate: (v) =>
                  v.length > 0 ||
                      'Imię nie może być puste',
                required: true,
                min: 3,                
              })}
              inputProps={{
                name: 'responsiblePerson.name',
              }}
              error={Boolean(errors?.responsiblePerson?.name)}
            />
            <TextField
              style={{ width: '100%' }}
              label="Nazwisko"
              value={watch('responsiblePerson.surname')}
              inputRef={register({
                required: true,
              })}
              inputProps={{
                name: 'responsiblePerson.surname',
              }}
              error={Boolean(errors?.responsiblePerson?.surname)}
            />
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="space-around" alignItems="flex-start" p={4}>
            <TextField
              style={{ width: '100%' }}
              label="Kwota"
              type="number"
              value={watch('amount')}
              inputRef={register({
                validate: (v) => v >= 10 || 'Minimalna kwota to 10 zł'
              })}
              inputProps={{
                name: 'amount',
              }}
              error={Boolean(errors?.amount)}
            />
            { <FormControlLabel
              control={
                <Controller
                  defaultValue={false}
                  name="oneDay"
                  control={control}
                  render={(props) => (
                    <Checkbox
                      {...props}
                      checked={props.value}
                      value={props.value}
                      onChange={(e) => props.onChange(e.target.checked)}
                      color="primary"
                    />
                  )}
                />
              }
              label="Impreza jednodniowa?"
            />}
            <Box display="flex" style={{ width: '100%' }}>
              <Controller
                defaultValue={false}
                name="startDate"
                control={control}
                render={(props) => (
                  <KeyboardDatePicker
                    {...props}
                    style={{ width: '100%', marginRight: watch('oneDay') ? '0px' : '16px' }}
                    disableToolbar
                    disableFuture={false}
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="Data startu"
                    value={props.value}
                    onChange={ props.onChange}
                    //   renderDay={renderDayInPicker}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                )}
              />
              {!watch('oneDay') ? <Controller
                defaultValue={false}
                name="endDate"
                control={control}
                render={(props) => (
                  <KeyboardDatePicker
                    {...props}
                    style={{ width: '100%', marginLeft: '16px' }}
                    disableToolbar
                    disableFuture={false}
                    format="dd/MM/yyyy"
                    margin="normal"
                    label="Data startu"
                    value={props.value}
                    onChange={ props.onChange}
                    //   renderDay={renderDayInPicker}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                )}
              /> : <></>}
            </Box>
            <Select
              style={{ width: '100%' }}
              label="Typ imprezy"
              value={selectedCode.value}
              onChange={(e: React.ChangeEvent<{ value: unknown }>): void => handleSelectCode(e.target.value as string)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {codePattern.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {props.isAdmin ? <FormControlLabel
              control={
                <Controller
                  defaultValue={false}
                  name="wholeOrganization"
                  control={control}
                  render={(props) => (
                    <Checkbox
                      {...props}
                      checked={props.value}
                      value={props.value}
                      onChange={(e) => props.onChange(e.target.checked)}
                      color="primary"
                    />
                  )}
                />
              }
              label="Kod dla całego hufca?"
            /> : <></>}
            {!watch('wholeOrganization') ? <Box style={{ width: '100%' }}>
              <Typography>Drużyny przypisane do kodu:</Typography>
              <Select
                style={{ width: '100%' }}
                multiple
                value={selectedTeams}
                onChange={handleChange}
                renderValue={(selected: unknown) => (
                  <Box style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value: string) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {Object.keys(registry).map((team) => (
                  <MenuItem
                    key={team}
                    value={team}
                  >
                    <Checkbox checked={selectedTeams.indexOf(team) > -1} />
                    <ListItemText primary={team} />
                  </MenuItem>
                ))}
              </Select></Box> : <></> }
          </Box>
        </Box>
      </Box>
      <Paper style={{ width: '50%', margin: '0 auto' }}>
        <Box display="flex" flexDirection="column" p={4}>

          <Typography>Wygenerowany kod:</Typography>
          <code style={{ margin: '16px', fontSize: '24px' }}>
            {`${selectedCode.value}${generateNextNumber()}`}
          </code>
          <Button color="primary" variant="contained" onClick={handleSubmit((data) => console.log({ ...data, teams: selectedTeams }))}>Zaakceptuj</Button>
        </Box>
      </Paper>
    </main>
  );
};

export default CodeGenerator;
