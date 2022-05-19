import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Appbar = () => {
    return (
        <>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2 }}
              >
                Safe<mark>Word</mark>
              </Typography>
              <Search sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search vault…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="add to vault"
                sx={{ ml: 1 }}
                component={Link}
                to="/additem"
              >
                <AddCircleRoundedIcon />
              </IconButton>
            </Toolbar>
        </AppBar>
        </>
    );
};

export default Appbar;