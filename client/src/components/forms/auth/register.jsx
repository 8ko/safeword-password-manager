import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from "../../../api/axios";
import { EmailRegex, PwdRegex } from "../../../constants";

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

import Grid from '@mui/material/Grid';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const REGISTER_URL = '/register';

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || '');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState(location.state?.pwd || '');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [confirmPwd, setConfirmPwd] = useState(location.state?.confirmPwd || '');
    const [matchPwd, setMatchPwd] = useState(false);
    const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const [agreeToc, setAgreeToc] = useState(false);
    const handleChange = (event) => {
        setAgreeToc(event.target.checked);
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
        setMatchPwd(pwd === confirmPwd);
    }, [pwd, confirmPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, confirmPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = EmailRegex.test(email);
        const v2 = PwdRegex.test(pwd);
        const v3 = pwd === confirmPwd;
        if (!v1 || !v2 || !v3) {
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
            // clear input fields
            setEmail('');
            setPwd('');
            setConfirmPwd('');

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
        if (pwd && !validPwd) {
            return (
                <FormHelperText error={!pwdFocus}>
                    At least 12 characters, A-Z, a-z, 0-9, and !@#$%^*
                </FormHelperText>
            )
        }
        return <FormHelperText />
    }

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ pr: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center', mb: 1 }}>
                        Create Account
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
                                InputLabelProps={{ required: false }}
                                required
                                id="email"
                                ref={userRef}
                                autoComplete="off"
                                placeholder="user@domain.com"
                                label="Email"
                                variant="standard"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                error={!emailFocus && email && !validEmail ? true : false}
                                helperText={!emailFocus && email && !validEmail ? "Not valid email." : ''}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <KeyRoundedIcon sx={{ color: 'action.active', mt: 2.8 }} />
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">Master Password</InputLabel>
                                <Input
                                    required
                                    id="password"
                                    autoComplete="off"
                                    label="Master Password"
                                    placeholder="************"
                                    value={pwd}
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
                        </Grid>
                        <Grid item xs={1}>
                            <CheckRoundedIcon sx={{ color: 'action.active', mt: 2.8 }} />
                        </Grid>
                        <Grid item xs={10}>
                            <FormControl fullWidth variant="standard">
                                <InputLabel htmlFor="standard-adornment-password">Re-type Master Password</InputLabel>
                                <Input
                                    required
                                    id="confirm-password"
                                    autoComplete="off"
                                    label="Re-type Master Password"
                                    placeholder="************"
                                    value={confirmPwd}
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={(e) => setConfirmPwd(e.target.value)}
                                    onFocus={() => setConfirmPwdFocus(true)}
                                    onBlur={() => setConfirmPwdFocus(false)}
                                    error={!confirmPwdFocus && confirmPwd && !matchPwd ? true : false}
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
                                {
                                    (!confirmPwdFocus && confirmPwd && !matchPwd &&
                                        <FormHelperText component={'span'} error={true}>
                                            Password does not match
                                        </FormHelperText>
                                    )
                                }
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{
                        textAlign: 'center',
                        alignItems: 'center',
                        lineHeight: '12px',
                        mt: 3
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
                            I agree to the <Link to="/terms" state={{ email, pwd, confirmPwd }} style={{ textDecoration: 'none' }}>Terms & Conditions</Link> and <Link to="/privacy" state={{ email, pwd, confirmPwd }} style={{ textDecoration: 'none' }}>Privacy Policy</Link>
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={!validEmail || !agreeToc || !validPwd || !matchPwd ? true : false}
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