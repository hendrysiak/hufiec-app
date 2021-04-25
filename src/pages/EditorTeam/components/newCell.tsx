import { Input, TableCell } from '@material-ui/core';

import React from 'react';

import { deleteTeamMember, permanentDeleteTeamMember } from 'helpers/editing-db.handler';
import { Rows } from 'models/global.enum';

import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'pages/Team/helpers/member-fee.helper';

import { IPerson } from '../EditorTeam';
import { useStyles } from '../stylesTable';

interface IProps {
  row: IPerson;
  name: string;
  id?: string | number | null;
  newData: Partial<APIPerson> | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, b: IPerson) => void;
}

export const CustomTableCell = ({ row, name, onChange, id, newData }: IProps) => {
  const classes = useStyles();
  return (
    <TableCell align="left" className={classes.tableCell}>
      {row.id === id && name ? (
        <Input
          value={newData && newData[name] ? newData[name] : row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
          disabled={name === Rows.Lp}
        />
      ) : (
        name && row[name]
      )}
    </TableCell>
  );
};

