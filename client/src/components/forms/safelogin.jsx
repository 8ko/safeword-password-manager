import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

import { VaultItemTypes } from '../../constants';
import validateSafeForm from './validateSafeForm';

import useAuth from "../../hooks/useAuth";
import useVault from '../../hooks/useVault';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ADD_URL = '/addlogin';
const UPDATE_URL = '/updatelogin';
const DELETE_URL = '/deletelogin';
const DECRYPT_URL = '/decrypt';

const HIBP_ACC_URL = '/hibp/account';
const HIBP_PWD_URL = '/hibp/password';

const SafeLogin = forwardRef((props, ref) => {

    const { auth } = useAuth();
    const { vault, setVault } = useVault();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [values, setValues] = React.useState({
        type: 0,
        id: 0,
        title: '',
        username: '',
        password: '',
        website: '',
        note: '',
        prompt: false,
        showPassword: false,
        decrypted: false
    });

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    
    const user = decoded?.id || 0;

    const handleChange = (props) => (event) => {
        event.preventDefault();
        setValues({ ...values, [props]: event.target.value });
    };

    const handlePromptChange = (event) => {
        setValues({ ...values, prompt: event.target.checked });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleVerifyUsername = async () => {
        await axiosPrivate.post(HIBP_ACC_URL, {
            acc: values.username 
        }).then(res => {
            const breaches = res.data?.breaches?.length || 0;
            const pastes = res.data?.pastes?.length || 0;
            if (breaches || pastes) {
                Swal.fire({
                    title: 'Oh no - pwned!',
                    text: `Pwned in ${breaches} data breaches and found ${pastes} pastes.`,
                    icon: 'warning',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                });
            } else {
                Swal.fire({
                    title: 'Good news - no pwnage found!',
                    text: 'No breached accounts and no pastes.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                });
            }
        });
    };

    const handleVerifyPassword = async () => {
        await axiosPrivate.post(HIBP_PWD_URL, {
            pwd: values.password 
        }).then(res => {
            const pwns = res.data?.pwns || 0;
            if (pwns) {
                Swal.fire({
                    title: 'Oh no - pwned!',
                    text: `This password has been seen ${pwns} times before. This password has previously appeared in a data breach and should never be used. If you've ever used it anywhere before, change it!`,
                    icon: 'warning',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                });
            } else {
                Swal.fire({
                    title: 'Good news - no pwnage found!',
                    text: 'This password was not found in any of the Pwned Passwords loaded into Have I Been Pwned.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                });
            }
        });
    };

    // invoked when selected item from sidebar or props updated
    useEffect(() => {
        if (props.prop1 && props.prop1.password) {
            // decrypt password upon render
            axiosPrivate.post(DECRYPT_URL, {
                data: props.prop1.password
            }).then((res) => {
                // update props with decrypted password
                setValues({
                    type: props.prop1.type || 0,
                    id: props.prop1.id || 0,
                    title: props.prop1.title || '',
                    username: props.prop1.username || '',
                    password: res.data,
                    website: props.prop1.website || '',
                    note: props.prop1.note || '',
                    prompt: Boolean(props.prop1.prompt) || false,
                    iv: props.prop1.iv || '',
                    decrypted: true
                });
            });
        }
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    useImperativeHandle(ref, () => ({
        addItem() {
            var err = '';
            if (Object.keys(err = validateSafeForm(values, VaultItemTypes.Login)).length) {
                return Swal.fire({
                    title: 'Error!',
                    text: err,
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                });
            }

            axiosPrivate.post(ADD_URL, {
                user: user,
                title: values.title,
                username: values.username,
                password: values.password,
                website: values.website,
                note: values.note,
                prompt: values.prompt
            }).then(res => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password has been added to your vault.',
                    icon: 'success',
                    // showConfirmButton: false,
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;'
                }).then((result) => {
                    window.location.reload();
                });
            });
        },

        updateItem() {
            var err = '';
            if (Object.keys(err = validateSafeForm(values, VaultItemTypes.Login)).length) {
                return Swal.fire({
                    title: 'Error!',
                    text: err,
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                });
            }

            axiosPrivate.post(`${UPDATE_URL}/${values.id}`, {
                title: values.title,
                username: values.username,
                password: values.password,
                website: values.website,
                note: values.note,
                prompt: values.prompt
            }).then(res => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Card has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: 'true',
                    closeButtonHtml: '&times;'
                }).then(() => {
                    const data = { ...res.data, type: VaultItemTypes.Login };
                    setVault({...vault, logins: vault.logins.map((item) => (item.id === values.id ? res.data : item))});
                    navigate('/', { state: { data } });
                });
            });
        },

        deleteItem() {
            axiosPrivate.delete(`${DELETE_URL}/${values.id}`)
                .then(() => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Account has been removed from your vault.',
                        icon: 'success',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: 'true',
                        closeButtonHtml: '&times;'
                    }).then((result) => {
                        props.onDelete();
                        setVault({...vault, logins: vault.logins.filter((item) => item.id !== values.id )});
                    });
                });
        },
    }))

    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="on"
                sx={{ mb: 1.5 }}
            >
                <TextField
                    id="outlined-title"
                    label="Title"
                    value={values.title}
                    onChange={handleChange('title')}
                    style={{ minWidth: '25%', width: '100%' }} />
            </Box>

            <FormControl sx={{ mb: 1.5 }}
                style={{ minWidth: '25%', width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-username">Username or Email</InputLabel>
                <OutlinedInput
                    id="username"
                    label="Username or Email"
                    value={values.username}
                    onChange={handleChange('username')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip title="Verify Security">
                                <IconButton
                                    aria-label="verify security"
                                    edge="end"
                                    onClick={handleVerifyUsername}
                                >
                                    <CheckCircleOutlineRoundedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Copy">
                                <IconButton
                                    aria-label="copy input"
                                    onClick={() => navigator.clipboard.writeText(values.username)}
                                    edge="end"
                                >
                                    <ContentCopyRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <FormControl sx={{ mb: 1.5 }}
                style={{ minWidth: '25%', width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip title="Toggle Visibility">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Verify Security">
                                <IconButton
                                    aria-label="verify security"
                                    edge="end"
                                    onClick={handleVerifyPassword}
                                >
                                    <CheckCircleOutlineRoundedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Copy">
                                <IconButton
                                    aria-label="copy input"
                                    onClick={() => navigator.clipboard.writeText(values.password)}
                                    edge="end"
                                >
                                    <ContentCopyRoundedIcon />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    }
                    label="Password" />
            </FormControl>

            <FormControl sx={{ mb: 1.5 }}
                style={{ minWidth: '25%', width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-website">Website</InputLabel>
                <OutlinedInput
                    id="outlined-website"
                    label="Website"
                    value={values.website}
                    onChange={handleChange('website')}
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip title="Copy">
                                <IconButton
                                    aria-label="copy input"
                                    onClick={() => navigator.clipboard.writeText(values.website)}
                                    edge="end"
                                >
                                    <ContentCopyRoundedIcon />
                                </IconButton>
                            </Tooltip>

                        </InputAdornment>
                    }
                />
            </FormControl>

            <FormControl sx={{ mb: 1.5 }}
                style={{ minWidth: '25%', width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Note</InputLabel>
                <OutlinedInput
                    id="outlined-note"
                    label="Note"
                    multiline
                    rows={3}
                    value={values.note}
                    onChange={handleChange('note')}
                />
            </FormControl>

            <Box sx={{ width: '100%', mb: 1 }}>
                <Stack direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 4 }}
                >
                    <Typography variant="subtitle2" id="masterpassword-re">
                        Master Password reprompt
                    </Typography>
                    <Checkbox
                        size="small"
                        checked={values.prompt}
                        onChange={handlePromptChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Box>
        </>
    );
});

export default SafeLogin;