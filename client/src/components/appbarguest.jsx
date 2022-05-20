import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const AppbarGuest = () => {
    return (
        <>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, alignItems: 'center' }}>
            <Toolbar>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2 }}
              >
                Safe&nbsp;<mark>Word</mark>
              </Typography>
            </Toolbar>
        </AppBar>
        </>
    );
};

export default AppbarGuest;