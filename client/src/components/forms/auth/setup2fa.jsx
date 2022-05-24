import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { PwdRegex } from "../../../constants";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";

import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import TextsmsRoundedIcon from '@mui/icons-material/TextsmsRounded';

const SetUp2FA = () => {

    const { auth } = useAuth();
    const navigate = useNavigate();

    const email = auth?.email || '';

    const [authType, setAuthType] = React.useState('email');
    const [authEmail, setAuthEmail] = React.useState('');
    const [authSMS, setAuthSMS] = React.useState('');


    const handleChange = (event: SelectChangeEvent) => {
        setAuthType(event.target.value);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     await axios.post(RESET_URL,
    //         JSON.stringify({ email, pwd }),
    //         {
    //             headers: { 'Content-Type': 'application/json' },
    //             withCredentials: true
    //         }
    //     );

    //     Swal.fire({
    //         title: 'A password reset link has been sent to your email.',
    //         text: 'Please click on the link that has been sent to your email.',
    //         icon: 'success',
    //         showConfirmButton: true,
    //         confirmButtonColor: '#318ce7',
    //         confirmButtonText: 'Okay',
    //         showCloseButton: true,
    //         closeButtonHtml: '&times;'
    //     }).then((result) => {
    //         navigate('/settings');
    //     });
    // };

    return (
        <>
            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
            {/* <form onSubmit={handleSubmit}> */}
            <Typography variant="h4"
                sx={{ textAlign: 'center', mb: 4 }}>
                Set up 2FA
            </Typography>

            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth sx={{mb:1.5}}>
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
                            id="outlined-name"
                            label="Email Address"
                            placeholder
                            value={email}
                            onChange={handleChange}
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
                            label="Phone Number"
                            placeholder
                            value={authSMS}
                            onChange={handleChange}
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
                    ||
                    <TextField
                        fullWidth
                        required
                        id="outlined-name"
                        label="Email address"
                        placeholder
                        value={email}
                        onChange={handleChange}
                        InputLabelProps={{ required: false }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailRoundedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                }





            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                    type="submit"
                    color="primary"
                    variant="outlined"
                >
                    Send Code
                </Button>
            </Box>
            {/* </form> */}
        </>
    )
}

export default SetUp2FA;