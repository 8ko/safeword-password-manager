import React from 'react'; 
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const pwet = [
  "u is gay",
  "i am gay",
  "eat my ass",
  "suck fat cock",
  "eat my shit",
  "i love booba",
  "big pp",
  "show bobs",
  "show vegana",
  "bata pa ko kol",
  "sakit kaayo kol",
  "kol bata pa ko kol",
  "imong pante"
];

const AppbarGuest = () => {
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
            >
              <Tooltip title={pwet[parseInt(Math.random() * pwet.length)]} placement="bottom">
                <InfoIcon />
              </Tooltip>
            </IconButton>
          </Stack>
        </AppBar>
      </Toolbar>
    </>
  );
};

export default AppbarGuest;