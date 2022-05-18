import * as React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Vault from "./pages/vault";
import AddItem from "./pages/additem";
import Generator from "./pages/generator";
import Settings from "./pages/settings";
import EmptyVault from "./pages/emptyvault";

import BottomNav from "./components/bottomnav";
import Appbar from "./components/appbar";
import Sidebar from "./components/sidebar";
import Toolbar from '@mui/material/Toolbar';

function App() {

  const drawerWidth = 200;
  const bottomNavHeight = 7;

  return (
    <div className="App">
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Appbar />
          <Sidebar width={drawerWidth} />
          <Box component="main" sx={{ flexGrow: 1, p: 4, mb: bottomNavHeight }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<Vault />} />
              <Route path="/additem" element={<AddItem />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/emptyvault" element={<EmptyVault />} />
            </Routes>
          </Box>
        </Box>
        <BottomNav />
      </Router>
    </div>
  );
}

export default App;
