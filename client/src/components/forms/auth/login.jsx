import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Tooltip, Typography } from '@mui/material';

import Grid from '@mui/material/Grid';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

import safeword from '../../../safeword';

const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const vaultKey = await safeword.hash(email + pwd);
            const authPwd = await safeword.hash(vaultKey + pwd);
            
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, pwd: authPwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(response.data);
            const accessToken = response?.data?.accessToken;

            // clear input
            setEmail('');
            setPwd('');

            if (response?.data?.tfa) {
                navigate('/verify2fa', { state: { email, accessToken, vaultKey }, replace:true})
            } else {
                localStorage.setItem('vaultKey', vaultKey);
                setAuth({ accessToken });
                navigate('/');
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing email or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else if (err.response?.status === 403) {
                setErrMsg('Email not verified');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ pr: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center', mb: 1 }}>
                        Unlock Vault
                    </Typography>
                    <Grid container
                        alignItems="flex-start"
                        justifyContent="center"
                        columnSpacing={5}
                        rowSpacing={0.5}
                    >
                        <Grid item xs={1}>
                            <AlternateEmailIcon sx={{ color: 'action.active', mt: 2.8 }} />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                value={email}
                                ref={userRef}
                                autoComplete="off"
                                placeholder="user@domain.com"
                                label="Email"
                                variant="standard"
                                onChange={(e) => setEmail(e.target.value)}
                                InputLabelProps={{ required: false }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <KeyRoundedIcon sx={{ color: 'action.active', mt: 2.8, mb: 1 }} />
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">Master Password</InputLabel>
                                <Input
                                    id="password"
                                    value={pwd}
                                    label="Master Password"
                                    placeholder="************"
                                    onChange={(e) => setPwd(e.target.value)}
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <Tooltip title="Toggle Visibility">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/* <Typography variant="subtitle2" sx={{ textAlign: 'right', mr: 2 }}>
                        <Link to="/forgotpassword" style={{ textDecoration: 'none' }}>Forgot password?</Link>
                    </Typography> */}
                    <Box sx={{ textAlign: 'center', mt: 3, }}>
                        <Button type="submit" color="primary" variant="outlined">
                            Login
                        </Button>
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="overline" >
                            No account? <Link to="/register" style={{ textDecoration: 'none' }}>sign up</Link>
                        </Typography>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default Login;