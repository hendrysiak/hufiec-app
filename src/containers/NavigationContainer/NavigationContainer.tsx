import { Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'shared/LogOut/LogOut';

import Navigation from 'shared/Navigation/Navigation';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from 'providers/AuthUserProvider/AuthUserProvider';

interface NavigationContainerProps {
  children: React.ReactElement | React.ReactElement[];
  isAdmin?: boolean;
}

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: `${theme.spacing(8)} ${theme.spacing(3)} ${theme.spacing(3)}`,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function NavigationContainer(props: NavigationContainerProps): JSX.Element {
  const pathname = usePathname();
  const { signOutFromApp } = useAuth();
  const router = useRouter()
  
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <Box>
      { pathname !== '/' ? <AppBar position="fixed" open={open}>
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" alignItems="center">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Menu
              </Typography>

            </Box>
        { pathname !== '/letter' ? <Tooltip sx={{ justifySelf: 'flex-end' }} title="Wyloguj" aria-label="log-out">
          <IconButton color="inherit" onClick={() => signOutFromApp()?.then(() => router.push('/'))} size="large"><ExitToAppIcon className="clicked" /></IconButton>
        </Tooltip>: <></> }
          </Box>
        </Toolbar>
      </AppBar> : <></> }
      { props.isAdmin && pathname !== '/login' && pathname !== '/letter' ? <Navigation open={open} handleDrawerClose={handleDrawerClose} /> : <></> }
      <Main open={open}>{ props.children }</Main>

    </Box>
  );
}

export default NavigationContainer;
