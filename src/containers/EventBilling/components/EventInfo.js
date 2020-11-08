import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

 const EventInfo = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.title}
    </Typography>
      <Typography component="p" variant="h4">
        {props.cash}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        wszystkich wpływów
      </Typography>
      <div>
        <Link color="primary" href="/codes">
          Przejdź do analizy wpływów po kodzie
        </Link>
      </div>
    </React.Fragment>
  );
}

export default EventInfo;