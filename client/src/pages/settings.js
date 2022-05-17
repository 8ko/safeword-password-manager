import React from "react";

import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Slider, { SliderThumb } from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';

import Checkbox from '@mui/material/Checkbox';

import Switch from '@mui/material/Switch';

export default function Settings() {
    //checkboxes
    const [checked, setChecked] = React.useState(true);
    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <div>
            <Toolbar />
            <Box sx={{ mb: 4 }}>
                <h2>Settings</h2>
            </Box>

            <Box sx={{ width: '95%', mb: 0.5 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="input-slider" gutterLeft>
                            Dark Mode
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Switch/>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '95%' }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="checkbox-something" gutterLeft>
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
                        <Typography id="input-slider" gutterLeft>
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
                <Typography id="input-slider" gutterLeft>
                    Reset Master Password
                </Typography>
            </Box>
            
            <Box sx={{ width: '95%', mb: 1 }}>
                <Typography id="input-slider" gutterLeft>
                    Sample Settings
                </Typography>
            </Box>

            <Box sx={{ width: '95%', mb: 1 }}>
                <Typography id="input-slider" gutterLeft>
                    Enable 2FA
                </Typography>
            </Box>



        </div>
    );
}