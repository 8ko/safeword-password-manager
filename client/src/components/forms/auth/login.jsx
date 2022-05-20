import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import axios from "../../../api/axios";

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Typography } from '@mui/material';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import IconButton from '@mui/material/IconButton';

const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

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
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            setAuth({ email, accessToken });
            setEmail('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing email or password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login failed');
            }
            errRef.current.focus();
        }
    }
//
    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ mr: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center' }}>
                        Login
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                        <AlternateEmailIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
                        <TextField
                            required
                            fullWidth
                            id="email"
                            value={email}
                            ref={userRef}
                            autoComplete="off"
                            placeholder="user@email.com"
                            label="Email"
                            variant="standard"
                            onChange={(e) => setEmail(e.target.value)}
                            InputLabelProps={{ required: false }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                        <KeyRoundedIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
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
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 0.5, textAlign: 'right' }}>
                        <Link to="/register" style={{ textDecoration: 'none' }}>Forgot password?</Link>
                    </Typography>

                    <Box sx={{ textAlign: 'center', mt: 2.5, }}>
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