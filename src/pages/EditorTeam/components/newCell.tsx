import { Input, TableCell } from '@material-ui/core';

import React from 'react';

import { deleteTeamMember, permanentDeleteTeamMember } from 'helpers/editing-db.handler';
import { Rows } from 'models/global.enum';

import { APIPerson } from 'models/registry.models';
import { countingMemberFee } from 'pages/Team/helpers/member-fee.helper';

import { IPerson } from '../EditorTeam';
import { useStyles } from '../stylesTable';
import { checkOldColumnRenderer } from 'helpers/render/checkColumnRenderer';

interface IProps {
  row: IPerson;
  name: string;
  id?: string | number | null;
  newData: Partial<APIPerson> | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, b: IPerson) => void;
}

export const CustomTableCell = ({ row, name, onChange, id, newData }: IProps) => {
  const classes = useStyles();

  const renderCell = (value: unknown) => {
    if (typeof value === 'boolean' || typeof value === 'undefined') return checkOldColumnRenderer(value);
    return `${value}`;
  };

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
        name && renderCell(row[name])
      )}
    </TableCell>
  );
};

