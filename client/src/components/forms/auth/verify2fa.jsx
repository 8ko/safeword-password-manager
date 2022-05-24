import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth";

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Tooltip, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';

const Verify2FA = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const email = auth?.email || '';

    const [authType, setAuthType] = React.useState('');
    const [code, setCode] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAuthType(event.target.value);
    };

    return (
        <>
            {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
            {/* <form onSubmit={handleSubmit}> */}
            <Typography variant="h4"
                sx={{ textAlign: 'center', mb: 4 }}>
                Verify 2FA
            </Typography>

            <Box sx={{ textAlign: 'center', alignItems: 'center', mb: 2 }}>

                <Typography variant="subtitle2">
                    Enter the code that was sent to you.
                </Typography>

                <TextField
                    fullWidth
                    id="outlined-name"
                    label="Code"
                    value={code}
                    onChange={handleChange}
                    sx={{ mt: 2 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <VpnKeyRoundedIcon />
                            </InputAdornment>
                        ),
                    }}
                />

            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                    type="submit"
                    color="primary"
                    variant="outlined"
                >
                    Confirm
                </Button>
            </Box>
            {/* </form> */}
        </>
    )
}

export default Verify2FA;