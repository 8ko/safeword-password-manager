import React, { forwardRef } from 'react';

import Swal from 'sweetalert2';

import generator from 'generate-password';
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
import { Tooltip } from '@mui/material';

const PASSWORD_MIN = 6;
const PASSWORD_MAX = 128;

const Generator = forwardRef((props, ref) => {

    const password = generator.generate({
        length: PASSWORD_MIN,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        strict: true
    });

    const [values, setValues] = React.useState({
        password: password,
        length: PASSWORD_MIN,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
        strict: true
    });

    const generatePassword = (value) => {
        const newPassword = generator.generate({
            length: value.length,
            uppercase: value.uppercase,
            lowercase: value.lowercase,
            numbers: value.numbers,
            symbols: value.symbols,
            strict: value.strict
        });
        setValues({...value, password: newPassword});
    }

    // for length and password
    const handleChange = (props) => (event) => {
        event.preventDefault();
        setValues({ ...values, [props]: event.target.value });
    };
    
    // for checkbox
    const handleCheckChange = (event) => {
        const checkCount = values.uppercase + values.lowercase + values.numbers + values.symbols + event.target.checked;
        if (checkCount === 1) {
            return Swal.fire({
                title: 'Error!',
                text: 'At least one should be checked.',
                icon: 'error',
                showConfirmButton: false,
                showCloseButton: true,
                closeButtonHtml: '&times;',
                timer: 1500
            });
        }
        generatePassword({...values, [event.target.id]: event.target.checked});
    }

    // slider
    const Input = styled(MuiInput)`width: 42px;`;
    const [value, setValue] = React.useState(PASSWORD_MIN);
    const handleSliderChange = (event, newValue) => {
        generatePassword({...values, length: newValue});
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
        generatePassword({...values, length: event.target.value});
    };

    const handleBlur = () => {
        if (value < PASSWORD_MIN) {
            setValue(PASSWORD_MIN);
        } else if (value > PASSWORD_MAX) {
            setValue(PASSWORD_MAX);
        }
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
                    multiline
                    id="outlined-helperText"
                    label="Generated Password"
                    placeholder=""
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip title="Copy">
                                <IconButton
                                    aria-label="copy input"
                                    onClick={() => navigator.clipboard.writeText(values.password)}
                                    edge="end"
                                >
                                    <ContentCopyRoundedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Generate">
                                <IconButton
                                    aria-label="generate password"
                                    onClick={() => generatePassword(values)}
                                    edge="end"
                                >
                                    <CachedIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Box sx={{ width: '100%', mb: 1 }}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item>
                        <Typography id="input-slider">
                            Length
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <Slider
                            value={values.length}
                            onChange={handleSliderChange}
                            aria-labelledby="input-slider"
                            min={PASSWORD_MIN}
                            max={PASSWORD_MAX}
                        />
                    </Grid>
                    <Grid item>
                        <Input
                            value={values.length}
                            size="small"
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            inputProps={{
                                step: 2,
                                min: PASSWORD_MIN,
                                max: PASSWORD_MAX,
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
                            id="uppercase"
                            checked={values.uppercase}
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
                            id="lowercase"
                            checked={values.lowercase}
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
                            id="numbers"
                            checked={values.numbers}
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
                            id="symbols"
                            checked={values.symbols}
                            onChange={handleCheckChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>


        </div>
    );
});

export default Generator;