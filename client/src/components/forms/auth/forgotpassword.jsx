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

//implement? send otp instead

const ForgotPassword = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email]);



    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ mr: 2 }}>
                <form /*onSubmit={handleSubmit}*/>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center' }}>
                        Forgot Password
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                        <AlternateEmailIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
                        <TextField
                            required
                            id="email"
                            value={email}
                            ref={userRef}
                            required
                            autoComplete="off"
                            placeholder="user@email.com"
                            label="Email"
                            variant="standard"
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            InputLabelProps={{ required: false }}
                        />
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2.5, }}>
                        <Button type="submit" color="primary" variant="outlined">
                            Send Confirmation
                        </Button>
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="overline" >
                            <Link to="/login" style={{ textDecoration: 'none' }}>Back to login</Link>
                        </Typography>
                    </Box>

                </form>
            </Box>

        </>
    )
}

export default ForgotPassword;