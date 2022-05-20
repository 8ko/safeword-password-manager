import * as React from 'react';
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

import "@fontsource/roboto";
import RequireAuth from './components/requireauth';
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

  const [isDark, setAsDark] = React.useState(false);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setAsDark((isDark) => !isDark);
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
              { auth?.email ? <Appbar /> : <AppbarGuest /> }
              { auth?.email ? <Sidebar width={200} /> : <></> }
              <Box component="main" sx={{ flexGrow: 1, p: 4, mb: 7 }}>
                <Toolbar />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route element={<RequireAuth />}>
                    <Route path="/" element={<Vault />} />
                    <Route path="/additem" element={<AddItem />} />
                    <Route path="/generator" element={<Generator />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/emptyvault" element={<EmptyVault />} />
                  </Route>
                </Routes>
              </Box>
            </Box>
            { auth?.email ? <BottomNav /> : <></> }
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;
