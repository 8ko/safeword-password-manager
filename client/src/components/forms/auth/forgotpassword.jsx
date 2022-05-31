import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "../../../api/axios";
import { EmailRegex, PwdRegex } from "../../../constants";

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Tooltip, Typography } from '@mui/material';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import Swal from "sweetalert2";

const RESET_URL = '/reset';

const ForgotPassword = () => {

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [email]);

    useEffect(() => {
        setValidEmail(EmailRegex.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PwdRegex.test(pwd));
    }, [pwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    function MyFormHelperText() {
        const helperText = () => {
            if (pwd && !validPwd) {
                return (
                    <FormHelperText component={'span'} error={!pwdFocus}>
                        At least 12 characters, contain A-Z, a-z, 0-9, and !@#$%^*.
                    </FormHelperText>
                )
            } else {
                return 'Avoid sharing your master password to anyone.';
            }
        };
        return <FormHelperText>{helperText()}</FormHelperText>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post(RESET_URL,
            JSON.stringify({ email, pwd }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        
        Swal.fire({
            title: 'A password reset link has been sent to your email.',
            text: 'Please click on the link that has been sent to your email.',
            icon: 'success',
            showConfirmButton: true,
            confirmButtonColor: '#318ce7',
            confirmButtonText: 'Okay',
            showCloseButton: true,
            closeButtonHtml: '&times;'
        }).then((result) => {
            navigate('/login');
        });
    }

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ mr: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center' }}>
                        Forgot Password
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                        <AlternateEmailIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
                        <TextField
                            InputLabelProps={{ required: false }}
                            required
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            placeholder="user@email.com"
                            label="Email"
                            variant="standard"
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            error={!emailFocus && email && !validEmail ? true : false}
                            helperText={!emailFocus && email && !validEmail ? "Not valid email." : ''}
                            fullWidth
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
                        <KeyRoundedIcon sx={{ color: 'action.active', mr: 2, mb: 3.4 }} />
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                            <Input
                                required
                                id="password"
                                autoComplete="off"
                                label="New Password"
                                placeholder="************"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPwd(e.target.value)}
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                error={!pwdFocus && pwd && !validPwd ? true : false}
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
                            <MyFormHelperText />
                        </FormControl>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2.5, }}>
                        <Button
                            type="submit"
                            color="primary"
                            variant="outlined"
                            disabled={!validEmail || !validPwd ? true : false}
                        >
                            Reset Password
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