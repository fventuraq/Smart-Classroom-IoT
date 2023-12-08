import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ApartmentIcon from '@material-ui/icons/Apartment';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    margin: theme.spacing(1),
  },
}));

const MyMenu = () => {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <b>Smart Classroom Frontend</b>
          </Typography>

          <Button color="inherit" component={RouterLink} to="/" className={classes.link}>
            Inicio
          </Button>

          <Button
            color="inherit"
            aria-controls="entities-menu"
            aria-haspopup="true"
            className={classes.link}
            onClick={handleClick}
          >
            Entities
          </Button>
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem component={RouterLink} to="/entities/university" onClick={handleClose}>
              <ListItemIcon>
                <SchoolIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="University" />
            </StyledMenuItem>

            <StyledMenuItem component={RouterLink} to="/entities/campus" onClick={handleClose}>
              <ListItemIcon>
                <AccountBalanceIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Campus" />
            </StyledMenuItem>

            <StyledMenuItem component={RouterLink} to="/entities/andares" onClick={handleClose}>
              <ListItemIcon>
                <ApartmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Floors" />
            </StyledMenuItem>

            <StyledMenuItem component={RouterLink} to="/entities/salas" onClick={handleClose}>
              <ListItemIcon>
                <MeetingRoomIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Classroom" />
            </StyledMenuItem>
          </StyledMenu>       

          <Button color="inherit" component={RouterLink} to="/services" className={classes.link}>
            Services
          </Button>
          
          <Button color="inherit" component={RouterLink} to="/devices/listdevices" className={classes.link}>
            Devices
          </Button>

          <Button color="inherit" component={RouterLink} to="/subscriptions" className={classes.link}>
            Subscriptions
          </Button>

        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MyMenu;
