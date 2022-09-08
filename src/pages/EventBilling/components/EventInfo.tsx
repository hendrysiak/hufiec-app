import Link from '@mui/material/Link';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import React from 'react';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

type Props = {
  title: string;
  cashToBiling: number;
  cashFromIncomes: number;
}

const EventInfo = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.title}
      </Typography>
      <Typography component="p" variant="h4">
        {props.cashToBiling}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        do rozliczenia
      </Typography>
      <Typography component="p" variant="h4">
        {props.cashFromIncomes}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        realnych wpływów
      </Typography>
      <div>
        <Link color="primary" href="/codes">
          Przejdź do analizy wpływów po kodzie
        </Link>
      </div>
    </React.Fragment>
  );
};

export default EventInfo;