/* eslint-disable no-useless-escape */
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./../../../App.css";
import Swal from 'sweetalert2';

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Tooltip, Typography } from '@mui/material';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';

import axios from "../../../api/axios";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{12,32}$/;
const REGISTER_URL = '/register';

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const [agreeToc, setAgreeToc] = useState(false);
    const handleChange = (event) => {
        setAgreeToc(event.target.checked);
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        userRef.current.focus();
    }, [email]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(pwd); // u can space as password char???
        if (!v1 || !v2) {
            setErrMsg("Invalid entry");
            return;
        }
        try {
            await axios.post(REGISTER_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // console.log(response?.data);
            // console.log(response.accessToken);
            // console.log(JSON.stringify(response));
            // clear input fields
            setEmail('');
            setPwd('');

            Swal.fire({
                title: 'A verification link has been sent to your email.',
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
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 409) {
                setErrMsg('Email taken');
            } else {
                setErrMsg('Registration failed');
            }
            errRef.current.focus();
        }
    }

    function MyFormHelperText() {
        const helperText = () => {
            if (pwd && !validPwd) {
                return (
                    <FormHelperText component={'span'} error={!pwdFocus}>
                        At least 12 characters, contain A-Z, a-z, 0-9, and !@#$%^*.
                    </FormHelperText>
                )
                // } else if (pwd && pwdFocus && validPwd) {
                //     return (
                //         <FormHelperText
                //             component={'span'}
                //             sx={{
                //                 '& .MuiFormHelperText-root': {
                //                     color: '#4caf50 !important',
                //                 },
                //             }}
                //             style={{
                //                 '& .css-1d1r5q-MuiFormHelperText-root': {
                //                     color: '#4caf50 !important',
                //                 },
                //             }}
                //         >
                //             Avoid sharing your master password to anyone.
                //         </FormHelperText>
                //     )
            } else {
                return 'Avoid sharing your master password to anyone.';
            }
        };
        return <FormHelperText>{helperText()}</FormHelperText>;
    }

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ pr: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center', mb: 1 }}>
                        Create an Account
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
                            <InputLabel htmlFor="standard-adornment-password">Master Password</InputLabel>
                            <Input
                                required
                                id="password"
                                autoComplete="off"
                                label="Master Password"
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
                                                onMouseDown={handleMouseDownPassword}
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

                    <Box sx={{
                        textAlign: 'center',
                        alignItems: 'center',
                        lineHeight: '12px'
                    }}>
                        <Typography variant="overline" style={{ lineHeight: 0 }} >
                            <Checkbox
                                required
                                size="small"
                                checked={agreeToc}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                                style={{ transform: "scale(0.8)", height: 20 }}
                            />
                            I agree to the <Link to="/terms" style={{ textDecoration: 'none' }}>Terms & Conditions</Link> and <Link to="/privacy" style={{ textDecoration: 'none' }}>Privacy Policy</Link>


                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={!validEmail || !agreeToc || !validPwd ? true : false}
                        >
                            Sign Up
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Typography variant="overline">
                            Have an account? <Link to="/login" style={{ textDecoration: 'none' }}>log in</Link>
                        </Typography>
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default Register;