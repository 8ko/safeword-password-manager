import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { PwdRegex } from "../../../constants";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
import jwt_decode from "jwt-decode";

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Tooltip, Typography } from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

import Stack from '@mui/material/Stack';
import { grey } from '@mui/material/colors';

const RESET_URL = '/reset';

const ResetPassword = () => {

    const { auth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    
    const email = decoded?.email || '';

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [pwd]);

    useEffect(() => {
        setValidPwd(PwdRegex.test(pwd));
    }, [pwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd]);

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
            navigate('/settings');
        });
    }

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form onSubmit={handleSubmit}>
                <Typography variant="h4"
                    sx={{ textAlign: 'center' }}>
                    Reset Master Password
                </Typography>

                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                    <KeyRoundedIcon sx={{ color: 'action.active', mr: 2, mb: 3.4 }} />
                    <FormControl fullWidth variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                        <Input
                            required
                            id="password"
                            ref={userRef}
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


                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{
                        textAlign: 'center',
                        mt: 2
                    }}>
                    <Button
                        type="submit"
                        color="primary"
                        variant="outlined"
                        disabled={!validPwd ? true : false}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ color: grey['A700'], borderColor: grey['A700'] }}
                    >
                        Cancel
                    </Button>
                </Stack>
        </form>
        </>
    )
}

export default ResetPassword;