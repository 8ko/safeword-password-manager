import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';

const BottomNav = () => {
    const [value, setValue] = useState(0);
    const location = useLocation();

    useEffect(() => {
        setValue(location.pathname);
    },[location])

    return (
        <>
            <Paper
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <Divider />
                <BottomNavigation
                    color="primary"
                    showLabels
                    value={value}
                >
                    <BottomNavigationAction component={Link} to="/" label="Vault" value="/" icon={<LockRoundedIcon />} />
                    <BottomNavigationAction component={Link} to="/generator" label="Generator" value="/generator" icon={<CachedRoundedIcon />} />
                    <BottomNavigationAction component={Link} to="/settings" label="Settings" value="/settings" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Paper>
        </>
    );
}

export default BottomNav;
