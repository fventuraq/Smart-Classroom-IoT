import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            My FIWARE App
          </Typography>
          <Button color="inherit" component={RouterLink} to="/" className={classes.link}>
            Inicio
          </Button>
          <Button color="inherit" component={RouterLink} to="/register" className={classes.link}>
            Register
          </Button>
          <Button color="inherit" component={RouterLink} to="/devices/listdevices" className={classes.link}>
            Devices
          </Button>
          <Button color="inherit" component={RouterLink} to="/services" className={classes.link}>
            Services
          </Button>
          <Button
            color="inherit"
            aria-controls="entities-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            className={classes.link}
          >
            Entities
          </Button>
          <Menu
            id="entities-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={RouterLink} to="/entities/room" onClick={handleMenuClose}>
              Room
            </MenuItem>
            <MenuItem component={RouterLink} to="/entities/university" onClick={handleMenuClose}>
              University
            </MenuItem>
            <MenuItem component={RouterLink} to="/entities/campus" onClick={handleMenuClose}>
              Campus
            </MenuItem>
            <MenuItem component={RouterLink} to="/entities/andares" onClick={handleMenuClose}>
              Andares
            </MenuItem>
            <MenuItem component={RouterLink} to="/entities/salas" onClick={handleMenuClose}>
              Salas
            </MenuItem>
            {/* Agrega otros submenús según tus necesidades */}
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default MyMenu;
