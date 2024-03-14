import { styled } from '@mui/material/styles';

import { Checkbox, Input, Table } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const useStyles = styled('div')({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    display: 'flex',
    width: 120,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
});

export const CustomTable = styled(Table)({
  table: {
    minWidth: 650,
  },
});

export const CustomSelectTableCell = styled(TableCell)({
  selectTableCell: {
    display: 'flex',
    width: 120,
  },
});

export const CustomTableCell = styled(TableCell)({
  tableCell: {
    width: 130,
    height: 40,
  },
})

export const CustomCheckbox = styled(Checkbox)({
  input: {
    width: 130,
    height: 40,
  },
})

export const CustomInput = styled(Input)({
  input: {
    width: 130,
    height: 40,
  },
})

