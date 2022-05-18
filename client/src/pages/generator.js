import React from "react";

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
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';

import Checkbox from '@mui/material/Checkbox';

export default function Generator() {

    //generated password
    const [values, setValues] = React.useState({
        genpassword: '',
        length: 0,
    });

    const handleChange = (props) => (event) => {
        event.preventDefault();
        setValues({ ...values, [props]: event.target.value });
    };

    // slider
    const Input = styled(MuiInput)`width: 42px;`;

    const [value, setValue] = React.useState(8);
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 8) {
            setValue(8);
        } else if (value > 128) {
            setValue(128);
        }
    };

    //checkboxes
    const [checked, setChecked] = React.useState(true);
    const handleCheckChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <div>
            <Box sx={{ mb: 4 }}>
                <h2>Password Generator</h2>
            </Box>

            <FormControl sx={{ mb: 2.5 }}
                style={{ minWidth: '25%', width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Generated Password</InputLabel>
                <OutlinedInput
                    id="outlined-helperText"
                    label="Generated Password"
                    placeholder="Jasd9@$J(QEjas"
                    value={values.genpassword}
                    onChange={handleChange('genpassword')}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="copy input"
                                onClick={() => navigator.clipboard.writeText(values.genpassword)}
                                edge="end"
                            >
                                <ContentCopyRoundedIcon />
                            </IconButton>
                            <IconButton
                                aria-label="copy input"
                                onClick={() => navigator.clipboard.writeText(values.genpassword)}
                                edge="end"
                            >
                                <CachedIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Box sx={{ width: '100%', mb: 1}}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography id="input-slider">
                            Length
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={typeof value === 'number' ? value : 0}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            min={8}
                            max={128}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={value}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 4,
                                min: 8,
                                max: 128,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '100%', mb: 1.5 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="checkbox-caps">
                            A-Z
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={checked}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '100%', mb: 1.5 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="checkbox-small">
                            a-z
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={checked}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>


            <Box sx={{ width: '100%', mb: 1.5 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="checkbox-num">
                            0-9
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={checked}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '100%', mb: 1.5 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="checkbox-special">
                            !@#$%
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={checked}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>


        </div>
    );
}