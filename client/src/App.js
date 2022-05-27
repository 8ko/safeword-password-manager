import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

import "@fontsource/roboto";
import "./App.css";

import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import { ColorModeContext } from './context/color-context';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Vault from "./pages/vault";
import AddItem from "./pages/additem";
import Generator from "./pages/generator";
import Settings from "./pages/settings";
import EmptyVault from "./pages/emptyvault";
import TermsAndConditions from "./pages/terms";
import PrivacyPolicy from "./pages/privacy";
import FAQ from "./pages/faq";

import BottomNav from "./components/bottomnav";
import Appbar from "./components/appbar";
import AppbarGuest from './components/appbarguest';
import Sidebar from "./components/sidebar";
import Toolbar from '@mui/material/Toolbar';

import Login from "./components/forms/auth/login";
import Register from "./components/forms/auth/register";
import ForgotPassword from "./components/forms/auth/forgotpassword";
import ResetPassword from './components/forms/auth/resetpassword';
import SetUp2FA from './components/forms/auth/setup2fa';
import Verify2FA from './components/forms/auth/verify2fa';
import RequireAuth from './components/requireauth';
import PersistLogin from './components/persistlogin';

import useAuth from './hooks/useAuth';

function App() {

  const { auth } = useAuth();

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
    <Router>
      <div className="App">
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={isDark ? dark : light}>
            <CssBaseline />
            { isDark ? <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@5/dark.css" /> : <></> }
            <Box sx={{ display: 'flex' }}>
              { auth?.accessToken ? <Appbar /> : <AppbarGuest /> }
              { auth?.accessToken ? <Sidebar width={180} /> : <></> }
              <Box component="main" sx={{ flexGrow: 1, p: 4, mb: 7 }}>
                <Toolbar />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/verify2fa" element={<Verify2FA />} />
                  <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth />}>
                      <Route path="/" element={<Vault />} />
                      <Route path="/additem" element={<AddItem />} />
                      <Route path="/generator" element={<Generator />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/reset" element={<ResetPassword />} />
                      <Route path="/setup2fa" element={<SetUp2FA />} />
                      <Route path="/emptyvault" element={<EmptyVault />} />
                    </Route>
                  </Route>
                </Routes>
              </Box>
            </Box>
            { auth?.accessToken ? <BottomNav /> : <></> }
          </ThemeProvider>
        </ColorModeContext.Provider>
      </div>
    </Router>
  );
}

export default App;
