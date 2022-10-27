import { Box, Button, Checkbox, Chip, FormControlLabel, ListItemText, MenuItem, Paper, Select, TextField, Typography , SelectChangeEvent } from '@mui/material';

import { DesktopDatePicker } from '@mui/x-date-pickers';
import React from 'react';

import { Controller, useForm } from 'react-hook-form';

import { useSelector } from 'react-redux';

import { useLocation } from 'react-router';

import { saveProposal } from 'helpers/api-helpers/proposal';
import { codePattern } from 'helpers/event.helper';
import { ICode } from 'models/codes.models';
import { ProposalArea, ProposalKind } from 'models/global.enum';
import { Proposal } from 'models/proposal.models';
import { useSnackbar } from 'providers/SnackbarProvider/SnackbarProvider';

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
  locality: string;
}

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
  const user = useSelector((state: RootState) => state.user);

  const { setSnackbar } = useSnackbar();

  const { control, watch, register, errors, handleSubmit } = useForm<CodeGeneratorValues>({
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
      locality: 'w Rudzie Śląskiej'
    }
  });
  
  const [selectedCode, setSelectedCode] = React.useState(codePattern[0]);
  const [selectedTeams, setSelectedTeams] = React.useState<number[]>([]);

  const { pathname } = useLocation();

  React.useEffect(() => {
    !props.isAdmin && setSelectedTeams([Number(pathname.slice(1))]);
  }, [props.isAdmin]);

  const handleSelectCode = (code: string) => {
    const foundedCode = codePattern.find(c => c.value === code);
    if (foundedCode) setSelectedCode(foundedCode);
  };

  const handleChange = (event: { target: { value: unknown; }; }) => {
    const {
      target: { value },
    } = event;
    const newValues = typeof value === 'string' ? value.split(',').map(team => Number(team)) : [Number(value)];

    setSelectedTeams(
      // On autofill we get a stringified value.
      newValues
    );
  };

  const suffixHelper = (length: number, incrementValue: number) => {
    return length + incrementValue > 9 ? `${length + incrementValue}` : `0${length + incrementValue}`;
  };

  const generateNextNumber = () => {
    if (!codesMap) return '';

    const currentCodePrefixAmount = Object.values(codesMap)
      .filter(code => code.prefix === selectedCode?.value)
      .length;

    let suffix = '';

    if (currentCodePrefixAmount === 0) suffix = selectedCode.useSuffix ? '01' : '';
    // add code properties
    if (selectedCode.useSuffix) {
      let numberIncrement = 1;

      if (Object.values(codesMap).some(code => code.prefix === selectedCode?.value && suffixHelper(currentCodePrefixAmount, 1) === code.suffix )) {
        numberIncrement += 1;
      }
      suffix = suffixHelper(currentCodePrefixAmount, numberIncrement);
    }

    return suffix;
  };

  const handleSave = (data: CodeGeneratorValues) => {
    const { wholeOrganization, startDate, responsiblePerson, endDate, amount, locality } = data;

    const team = props.isAdmin ? null : Number(pathname.slice(1));

    const codeToSave: Omit<ICode, 'id'> = {
      amount,
      startDate,
      endDate,
      wholeOrganization,
      teams: team !== null ? [team] : selectedTeams,
      prefix: selectedCode.value,
      suffix: generateNextNumber(),
      decision: '',
      firstAccept: false,
      letter: false,
      responsiblePerson,
      locality
    };

    const author = user.evidenceNumber;

    if (author && window.confirm('Czy napewno chcesz zapisać kod?')) {
      const proposal: Proposal = {
        elementId: '',
        area: ProposalArea.Code,
        kind: ProposalKind.Add,
        author: author,
        team,
        oldValues: null,
        newValues: codeToSave
      };
      try {
        saveProposal(proposal);
        setSnackbar({ children: 'Kod pomyślnie zapisany', severity: 'success' });
      } catch {
        setSnackbar({ children: 'Wystąpił błąd przy zapisywaniu kodu', severity: 'error' });
      }
    }
  };


  return (
    <main>
      <Box>
        <Box>
          <Box display="flex" flexDirection="column" justifyContent="space-around" alignItems="center" px={4}>
            <Typography>Osoba odpowiedzialna:</Typography>
            <TextField
              margin="normal"
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
              margin="normal"
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
                  render={(props: { value: boolean | undefined, onChange: (checked: boolean) => void }) => (
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
                  <DesktopDatePicker
                    {...props}
                    renderInput={(params) => <TextField {...params} style={{ width: '100%', marginRight: watch('oneDay') ? '0px' : '16px' }} />}
                    inputFormat="dd/MM/yyyy"
                    label="Data startu"
                    value={props.value}
                    onChange={ props.onChange}
                    //   renderDay={renderDayInPicker}

                  />
                )}
              />
              {!watch('oneDay') ? <Controller
                defaultValue={false}
                name="endDate"
                control={control}
                render={(props) => (
                  <DesktopDatePicker
                    {...props}
                    renderInput={(params) => <TextField {...params} style={{ width: '100%', marginLeft: '16px' }} />}
                    inputFormat="dd/MM/yyyy"
                    label="Data startu"
                    value={props.value}
                    onChange={ props.onChange}
                    //   renderDay={renderDayInPicker}
                  />
                )}
              /> : <></>}
            </Box>
            <Select
              style={{ width: '100%', marginTop: '16px' }}
              label="Typ imprezy"
              value={selectedCode.value}
              onChange={
                (e: SelectChangeEvent<string>): void => handleSelectCode(e.target.value as string)}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {codePattern.filter(code => {
                if (props.isAdmin) return true;

                return !code.adminEvent;
              }).map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            <Typography style={{ marginTop: '16px' }}>Impreza organizowana w?:</Typography>
            <TextField
              style={{ width: '100%', marginTop: '16px' }}
              label="Odmieniona miejscowość"
              value={watch('locality')}
              inputRef={register({
                validate: (v) =>
                  v.length > 0 ||
                      'Miejscowość nie może być pusta',
                required: true,
                min: 3,                
              })}
              inputProps={{
                name: 'locality',
              }}
              error={Boolean(errors?.locality)}
            />
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
                    <Checkbox checked={selectedTeams.indexOf(Number(team)) > -1} />
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
            {`${selectedCode.value}${selectedCode.useSuffix ? '-' + generateNextNumber() : generateNextNumber()}`}
          </code>
          <Button color="primary" variant="contained" onClick={handleSubmit((data) => handleSave(data))}>Zaakceptuj</Button>
        </Box>
      </Paper>
    </main>
  );
};

export default CodeGenerator;


