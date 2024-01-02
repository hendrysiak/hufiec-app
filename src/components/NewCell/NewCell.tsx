import { Checkbox, Input, TableCell } from '@mui/material';

import React from 'react';

import { checkOldColumnRenderer } from 'helpers/render/checkColumnRenderer';
import { Rows } from 'models/global.enum';

import { APIPerson } from 'models/registry.models';

import { IPerson } from '../../pages/EditorTeam/EditorTeam';
import { useStyles } from '../../pages/EditorTeam/stylesTable';

interface IProps {
  row: IPerson;
  name: string;
  id?: string | number | null;
  useBoolean?: boolean;
  newData: Partial<APIPerson> | null;
  onChange: (e: { target: { value: string | boolean, name: string }}, b: IPerson) => void;
}

export function CustomTableCell({
  row, name, onChange, id, newData, useBoolean
}: IProps) {
  const classes = useStyles();

  const renderCell = (value: unknown) => {
    if (typeof value === 'boolean' || typeof value === 'undefined') return checkOldColumnRenderer(value);
    return `${value}`;
  };

  const getCheckedState = (): boolean => {
    if (newData === null) return Boolean(row[name]);

    if (name in newData) {
      return Boolean(newData[name])
    }

    return Boolean(row[name]);
  }

  const renderEditability = () => {
    if (row.id === id) {
      return typeof row[name] === 'boolean' || useBoolean ? (
        <Checkbox
          checked={getCheckedState()}
          name={name}
          onChange={(e) => {
            const value = e.target.checked;
            return onChange({ target: {
              value,
              name,
            }}, row)
          }}
          className={classes.input}
        />
      ) : (
        <Input
          value={newData && newData[name] ? newData[name] : row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
        />
      );
    } else {
      return renderCell(row[name]);
    }
  };

  return (
    <TableCell align="left" className={classes.tableCell}>
      {renderEditability()}
      {/* {row.id === id && name ? (
        <Input
          value={newData && newData[name] ? newData[name] : row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
          className={classes.input}
          disabled={name === Rows.Lp}
        />
      ) : (
        name && renderCell(row[name])
      )} */}
    </TableCell>
  );
}
