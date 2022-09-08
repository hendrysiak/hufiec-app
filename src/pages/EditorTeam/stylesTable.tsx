import makeStyles from '@mui/styles/makeStyles';

export const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));