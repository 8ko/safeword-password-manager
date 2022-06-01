import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const AppbarGuest = () => {
  const navigate = useNavigate();

  return (
    <>
      <Toolbar>
        <AppBar
          position="fixed"
          sx={{
            flexGrow: 1,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            px: 1
          }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
            >
              <img src={process.env.PUBLIC_URL + "/SafeLogo34Full.png"} alt="SafeLogo" />
            </IconButton>

            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={() => navigate('/faq')}
            >
              <InfoIcon />
            </IconButton>
          </Stack>
        </AppBar>
      </Toolbar>
    </>
  );
};

export default AppbarGuest;