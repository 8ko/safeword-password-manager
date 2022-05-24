import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';

import Stack from '@mui/material/Stack';
import { grey } from '@mui/material/colors';
import { EmailRegex, PhoneRegex } from "../../../constants";

const SetUp2FA = () => {

    const { auth } = useAuth();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const email = decoded?.email || '';

    const [authType, setAuthType] = useState('email');
    const [phone, setPhone] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAuthType(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (authType === 'email' && EmailRegex.test(email)) {
            await axiosPrivate.post('/tfa', {
                auth: email,
                type: authType
            }).then(res => {
                navigate('/verify2fa');
            });
        } else if (authType === 'sms' && PhoneRegex.test(phone)) {
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Invalid input.',
                icon: 'error',
                confirmButtonColor: '#318ce7',
                confirmButtonText: 'Okay',
                showCloseButton: true,
                closeButtonHtml: '&times;',
            });
        }
    };

    return (
        <>
            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
            <form onSubmit={handleSubmit}>
            <Typography variant="h4"
                sx={{ textAlign: 'center', mb: 4 }}>
                Set up 2FA
            </Typography>

            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{ mb: 1.5 }}>
                    <InputLabel id="auth-type-label">Authentication Type</InputLabel>
                    <Select
                        defaultValue={1}
                        fullWidth
                        labelId="auth-type-label-select"
                        id="auth-type-select"
                        value={authType}
                        label="Authentication Type"
                        onChange={handleChange}
                        sx={{ mb: 1 }}
                    >
                        <MenuItem value={'email'}>Email Address</MenuItem>
                        <MenuItem value={'sms'}>Phone Number</MenuItem>
                    </Select>
                </FormControl>
                {
                    (authType === 'email' &&
                        <TextField
                            fullWidth
                            required
                            readOnly
                            id="outlined-name"
                            label="Email Address"
                            value={email}
                            InputLabelProps={{ required: false }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MailRoundedIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )
                    || (authType === 'sms' &&
                        <TextField
                            fullWidth
                            required
                            id="outlined-name"
                            type="number"
                            label="Phone Number"
                            placeholder="09123456789"
                            autoComplete="off"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            inputProps={{
                                pattern: PhoneRegex
                            }}
                            InputLabelProps={{ required: false }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <TextsmsRoundedIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )
                }
            </Box>

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
                >
                    Send Code
                </Button>
                <Button
                    variant="outlined"
                    sx={{color: grey['A700'], borderColor: grey['A700']}}
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
            </Stack>
            </form>
        </>
    )
}

export default SetUp2FA;