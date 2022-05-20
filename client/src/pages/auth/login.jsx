import * as React from "react";
import Axios from "axios";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from "@mui/material/Link";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';


const Login = () => {

    const useRef = React.useRef();
    const errRef = React.useRef();

    const [user, setUser] = React.useState('');
    const [pwd, setPwd] = React.useState('');
    const [errMsg, setErrMsg] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const [values, setValues] = React.useState({
        email: '',
        masterpassword: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //handleSubmit
    const handleSubmit = async (e) => {
        if (user != "" || pwd != "") {
            if (user === "admin" && pwd === "1234") {
                e.preventDefault();
                console.log("Successfuly Logged IN");
                setSuccess(true);
                setUser('');
                setPwd('');


            } else {
                console.log("WRONG USER OR PASSWORD")
            }
        } else {
            console.log("Cant be blank")
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                <AlternateEmailIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
                <TextField
                    fullWidth
                    id="input-email"
                    placeholder="user@email.com"
                    value={values.email}
                    label="Email"
                    variant="standard"
                    onChange={handleChange('email')}
                />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 4 }}>
                <KeyRoundedIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
                <FormControl fullWidth variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">Master Password</InputLabel>
                    <Input
                        label="Master Password"
                        id="input-master"
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.masterpassword}
                        onChange={handleChange('masterpassword')}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Button type='submit' color='primary' variant="outlined" fullWidth
                    onClick={handleSubmit}>login
                </Button>
            </Box>

        </>
    )
}

export default Login;