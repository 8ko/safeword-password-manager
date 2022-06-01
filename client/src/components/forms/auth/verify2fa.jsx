import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';

import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';

const Verify2FA = () => {
    const errRef = useRef();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();

    const { setAuth } = useAuth();

    const email = location?.state?.email;
    const accessToken = location?.state?.accessToken;
    const vaultKey = location?.state?.vaultKey;

    const [code, setCode] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [code]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axiosPrivate.post('/tfa/verify', {code}
        ).then(res => {
            if (email && accessToken && vaultKey) {
                localStorage.setItem('vaultKey', vaultKey);
                setAuth({ accessToken });
                navigate('/');
            } else {
                Swal.fire({
                    title: 'Success!',
                    text: '2FA is now enabled.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                }).then((result) => {
                    navigate('/settings');
                });
            }
        }).catch(err => {
            if (!err?.response) {
                setErrMsg('No server response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid input');
            } else if (err.response?.status === 401) {
                setErrMsg('Invalid code');
            } else {
                setErrMsg('Verification failed');
            }
            errRef.current.focus();
        })
    };

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <form onSubmit={handleSubmit}>
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
                    autoComplete="off"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
            </form>
        </>
    )
}

export default Verify2FA;