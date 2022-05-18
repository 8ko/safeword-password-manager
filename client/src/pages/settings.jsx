import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';

export default function Settings() {
    //checkboxes
    const [checked, setChecked] = React.useState(true);
    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <h2>Settings</h2>
            </Box>

            {/* make all of dis into grid */}

            <Box sx={{ width: '95%', mb: 1.5 }}>
                <Typography id="input-slider">
                    Enable 2FA
                </Typography>
            </Box>

            <Box sx={{ width: '95%', mb: 0.5 }}>
                <Grid container spacing={1} justifyContent="center" alignItems="center">
                    <Grid item xs>
                        <Typography id="input-slider">
                            Dark Mode
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '95%' }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="checkbox-something">
                            Sample Settings
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={!checked}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '95%', mb: 1 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="input-slider">
                            Sample Settings
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={!checked}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '95%', mb: 1.5 }}>
                <Typography id="input-slider">
                    Reset Master Password
                </Typography>
            </Box>

            <Box sx={{ width: '95%', mb: 1.5 }}>
                <Typography id="input-slider">
                    Sample Settings
                </Typography>
            </Box>
        </>
    );
}