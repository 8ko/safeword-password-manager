/* eslint-disable no-unused-vars */
import * as React from 'react';
import "@fontsource/roboto";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ColorModeContext } from './context/color-context';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Vault from "./pages/vault";
import AddItem from "./pages/additem";
import Generator from "./pages/generator";
import Settings from "./pages/settings";
import EmptyVault from "./pages/emptyvault";

import BottomNav from "./components/bottomnav";
import Appbar from "./components/appbar";
import AppbarGuest from './components/appbarguest';
import Sidebar from "./components/sidebar";
import Toolbar from '@mui/material/Toolbar';

import Login from "./components/forms/auth/login";
import Register from "./components/forms/auth/register";
import ForgotPassword from "./components/forms/auth/forgotpassword";

import RequireAuth from './components/requireauth';
import PersistLogin from './components/persistlogin';

import useAuth from './hooks/useAuth';
import useRefreshToken from './hooks/useRefreshToken';

import axios from './api/axios';
import { useState, useEffect } from "react";

function App() {

  const { auth, setAuth } = useAuth();
  // uncomment to bypass auth screen
  // React.useEffect(() => {
  //   axios.post('/auth', { email:'a@a.com', pwd:'password' }).then(res => {
  //     const accessToken = res.data.accessToken;
  //     setAuth({accessToken});
  //   });
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let light = createTheme({
    palette: {
      mode: "light",
    }
  });
  light = responsiveFontSizes(light);

  let dark = createTheme({
    palette: {
      mode: "dark",
    }
  });
  dark = responsiveFontSizes(dark);

  const [isDark, setDark] = useState(localStorage.getItem('darkMode') === 'true' ? true : false);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        const darkMode = localStorage.getItem('darkMode') === 'true' ? false : true;
        localStorage.setItem('darkMode', darkMode);
        setDark(darkMode);
      },
    }),
    []
  );

  return (
    <div className="App">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={isDark ? dark : light}>
          <CssBaseline />
          <Router>
            <Box sx={{ display: 'flex' }}>
              { auth?.accessToken ? <Appbar /> : <AppbarGuest /> }
              { auth?.accessToken ? <Sidebar width={200} /> : <></> }
              <Box component="main" sx={{ flexGrow: 1, p: 4, mb: 7 }}>
                <Toolbar />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                      <Route path="/" element={<Vault />} />
                      <Route path="/additem" element={<AddItem />} />
                      <Route path="/generator" element={<Generator />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/emptyvault" element={<EmptyVault />} />
                    </Route>
                  </Route>
                </Routes>
              </Box>
            </Box>
            { auth?.accessToken ? <BottomNav /> : <></> }
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;
