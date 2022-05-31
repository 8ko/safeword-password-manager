import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

import Swal from 'sweetalert2';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ColorModeContext } from '../context/color-context';
import { styled } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import jwt_decode from "jwt-decode";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 45,
    height: 26,
    padding: 5,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(4px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(18px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#f9a825',
        width: 24,
        height: 24,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

export default function Settings() {
    const navigate = useNavigate();
    const logout = useLogout();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const user = decoded?.id || 0;

    const colorMode = React.useContext(ColorModeContext);
    const [isDark, setDark] = useState(Boolean(JSON.parse(localStorage.getItem('darkMode'))));
    const [tfaEnabled, set2FAEnabled] = useState(false);

    useEffect(() => {
        axiosPrivate.get(`/tfa/${user}`).then(res => {
            if (res.data === 'email' || res.data === 'phone') {
                set2FAEnabled(true);
            }
        });
    },[tfaEnabled,user,axiosPrivate])

    const setup2FA = () => {
        Swal.fire({
            title: 'Set up 2FA',
            input: 'password',
            inputPlaceholder: '************',
            text: 'Enter your master password to proceed:',
            showConfirmButton: true,
            confirmButtonColor: '#318ce7',
            confirmButtonText: 'Confirm',
            showCancelButton: true
        }).then(async (result) => {
            if (!result.isDismissed) {
                await axiosPrivate.post('/reprompt', {
                    user: user,
                    pwd: result.value
                }).then(res => {
                    navigate('/setup2fa');
                }).catch(err => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Incorrect master password.',
                        icon: 'error',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: true,
                        closeButtonHtml: '&times;',
                    });
                });
            }
        });
    }

    const disable2FA = async () => {
        Swal.fire({
            title: 'Disable 2FA',
            input: 'password',
            inputPlaceholder: '************',
            text: 'Enter your master password to proceed:',
            showConfirmButton: true,
            confirmButtonColor: '#318ce7',
            confirmButtonText: 'Confirm',
            showCancelButton: true
        }).then(async (result) => {
            if (!result.isDismissed) {
                await axiosPrivate.post('/tfa/disable', {
                    user: user,
                    pwd: result.value
                }).then(res => {
                    set2FAEnabled(false);
                }).catch(err => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Incorrect master password.',
                        icon: 'error',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: true,
                        closeButtonHtml: '&times;',
                    });
                });
            }
        });
    }

    const resetPwd = () => {
        Swal.fire({
            title: 'Reset Master Password',
            input: 'password',
            inputPlaceholder: '************',
            text: 'Enter your master password to proceed:',
            showConfirmButton: true,
            confirmButtonColor: '#318ce7',
            confirmButtonText: 'Confirm',
            showCancelButton: true
        }).then(async (result) => {
            if (!result.isDismissed) {
                await axiosPrivate.post('/reprompt', {
                    user: user,
                    pwd: result.value
                }).then(res => {
                    navigate('/reset');
                }).catch(err => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Incorrect master password.',
                        icon: 'error',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: true,
                        closeButtonHtml: '&times;',
                    });
                });
            }
        });
    }

    const handleThemeChange = (event) => {
        setDark(event.target.checked);
        colorMode.toggleColorMode();
    }

    const signOut = async () => {
        await logout();
        navigate('/login');
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <h2>Settings</h2>
            </Box>

            <Stack direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Typography id="input-slider">
                    Theme
                </Typography>
                <MaterialUISwitch
                    checked={isDark}
                    onChange={handleThemeChange}
                />
            </Stack>

            <Box sx={{ width: '100%', mb: 1.5 }}>
                <Stack spacing={1}>
                    {
                        tfaEnabled ? (
                        <Button variant="outlined" onClick={disable2FA}>
                            Disable 2FA
                        </Button>
                        ) : (
                        <Button variant="outlined" onClick={setup2FA}>
                            Set up 2FA
                        </Button>
                        )
                    }
                    <Button variant="outlined" onClick={resetPwd}>
                        Reset Master Password
                    </Button>
                    <Button variant="outlined" onClick={() => navigate('/faq')}>
                        FAQs
                    </Button>
                    <Button variant="outlined" onClick={signOut}>
                        Logout
                    </Button>
                </Stack>
            </Box>
        </>
    );
}