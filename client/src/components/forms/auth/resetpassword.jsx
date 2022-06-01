import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from 'react-router-dom';
import { PwdRegex, VaultItemTypes } from "../../../constants";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import jwt_decode from "jwt-decode";
import safeword from '../../../safeword';

import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Grid, Tooltip, Typography } from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import Stack from '@mui/material/Stack';
import { grey } from '@mui/material/colors';

const RESET_URL = '/reset';

const ResetPassword = () => {

    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const vault = location?.state?.vault || {};

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const email = decoded?.email || '';

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [confirmPwd, setConfirmPwd] = useState(location.state?.confirmPwd || '');
    const [matchPwd, setMatchPwd] = useState(false);
    const [confirmPwdFocus, setConfirmPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [pwd]);

    useEffect(() => {
        setValidPwd(PwdRegex.test(pwd));
    }, [pwd]);

    useEffect(() => {
        setMatchPwd(pwd === confirmPwd);
    }, [pwd, confirmPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, confirmPwd]);

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

        try {
            const vaultKey = await safeword.hash(email + pwd);
            const authPwd = await safeword.hash(vaultKey + pwd);

            await axiosPrivate.post(RESET_URL, {
                email, pwd: authPwd
            }).then(() => {
                // apply new key to vault
                vault.logins.forEach(item => {
                    const encrypted = safeword.encrypt(
                        JSON.stringify({
                            title: item.title,
                            username: item.username,
                            password: item.password,
                            website: item.website,
                            note: item.note,
                            prompt: item.prompt,
                            type: VaultItemTypes.Login
                        }), vaultKey);

                    axiosPrivate.post(`update/${item.id}`, {
                        data: encrypted
                    })
                });
                vault.cards.forEach(item => {
                    const encrypted = safeword.encrypt(
                        JSON.stringify({
                            title: item.title,
                            name: item.name,
                            number: item.number,
                            month: item.month,
                            year: item.year,
                            cvv: item.cvv,
                            note: item.note,
                            prompt: item.prompt,
                            type: VaultItemTypes.Card
                        }), vaultKey);

                    axiosPrivate.post(`update/${item.id}`, {
                        data: encrypted
                    })
                });
                vault.notes.forEach(item => {
                    const encrypted = safeword.encrypt(
                        JSON.stringify({
                            title: item.title,
                            note: item.note,
                            prompt: item.prompt,
                            type: VaultItemTypes.Note
                        }), vaultKey);

                    axiosPrivate.post(`update/${item.id}`, {
                        data: encrypted
                    })
                });

                Swal.fire({
                    title: 'Master Password Changed',
                    text: 'You will now be logged out of all devices.',
                    icon: 'success',
                    showConfirmButton: true,
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;'
                }).then((result) => {
                    window.location.reload();
                });
            });
        } catch (err) {
            // console.error(err);
        }
    }

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form onSubmit={handleSubmit}>
                <Typography variant="h4"
                    sx={{ textAlign: 'center' }}>
                    Change Master Password
                </Typography>

                <Grid container
                    alignItems="flex-start"
                    justifyContent="center"
                    columnSpacing={5}
                    rowSpacing={0.5}
                    >
                    <Grid item xs={1}>
                        <KeyRoundedIcon sx={{ color: 'action.active', mt: 2.8 }} />
                    </Grid>
                    <Grid item xs={10}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Master Password</InputLabel>
                            <Input
                                required
                                id="password"
                                ref={userRef}
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

                <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{
                        textAlign: 'center',
                        mt: 3
                    }}>
                    <Button
                        type="submit"
                        color="primary"
                        variant="outlined"
                        disabled={!validPwd || !matchPwd ? true : false}
                    >
                        Change
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ color: grey['A700'], borderColor: grey['A700'] }}
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </Stack>
        </form>
        </>
    )
}

export default ResetPassword;