import { Input, TableCell } from '@material-ui/core';
import React from 'react';

import { IPerson } from '../EditorTeam';
import { useStyles } from '../stylesTable';

interface IProps {
  row: IPerson
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, b: IPerson) => void;
}

export const CustomTableCell = ({ row, name, onChange }: IProps) => {
  const classes = useStyles();
  const { isEditMode } = row;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode && name ? (
        <Input
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
        />
      ) : (
        name && row[name]
      )}
    </TableCell>
  );
};