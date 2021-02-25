import { TableHead, TableRow, TableCell } from '@material-ui/core';

import React from 'react';

import { BudgetEntry } from 'models/global.enum';

type Props = {
  info: BudgetEntry;
}

const HeadRow = (props: Props): JSX.Element => {

  const head = props.info === BudgetEntry.Outcome 
    ? (
      <TableHead>
        <TableRow>
          <TableCell>Edytuj</TableCell>
          <TableCell>LP</TableCell>
          <TableCell>NR faktury</TableCell>
          <TableCell>Kwota</TableCell>
          <TableCell>Sposób finansowania</TableCell>
          <TableCell>Kategoria wydatku</TableCell>
          <TableCell>Jednostka</TableCell>
          <TableCell>Kod imprezy (automatycznie)</TableCell>
          <TableCell>Pełny tytuł</TableCell>
        </TableRow>
      </TableHead>
    )
    : (
      <TableHead>
        <TableRow>
          <TableCell>Edytuj</TableCell>
          <TableCell>LP</TableCell>
          <TableCell>Kwota</TableCell>
          <TableCell>Imię</TableCell>
          <TableCell>Nazwisko</TableCell>
          <TableCell>Jednostka</TableCell>
          <TableCell>Kod imprezy (automatycznie)</TableCell>
          <TableCell>Pełny tytuł</TableCell>
        </TableRow>
      </TableHead>
    );

  return head;
};

export default HeadRow;