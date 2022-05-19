import React, { useImperativeHandle, forwardRef, useEffect } from 'react';

import Axios from 'axios';
import Swal from 'sweetalert2';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
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
import Grid from '@mui/material/Grid';

const SafeLogin = forwardRef((props, ref) => {

    const [values, setValues] = React.useState({
        type: 0,
        id: 0,
        title: '',
        username: '',
        password: '',
        website: '',
        note: '',
        prompt: false,
        iv: '',
        showPassword: false,
        decrypted: false
    });

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

    // invoked when selected item from sidebar or props updated
    useEffect(() => {
        if (props.prop1 && props.prop1.password) {
            // decrypt password upon render
            Axios.post("http://localhost:3001/decryptpassword", {
                password: props.prop1.password,
                iv: props.prop1.iv,
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
    }, [props]);

    useImperativeHandle(ref, () => ({
        addItem() {
            var title = values.title;
            var username = values.username;
            var password = values.password;
            var website = values.website;
            var note = values.note;
            var prompt = values.prompt;

            if (title === '' || password === '') {
                return Swal.fire({
                    title: 'Error!',
                    text: 'Please fill out the fields.',
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                    timer: 1500,
                });
            }

            Axios.post("http://localhost:3001/addlogin", {
                title: title,
                username: username,
                password: password,
                website: website,
                note: note,
                prompt: prompt
            }).then(res => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Password has been added to your vault.',
                    icon: 'success',
                    // showConfirmButton: false,
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                    timer: 5000
                }).then((result) => {
                    window.location.reload();
                });
            });
        },
        updateItem() {
            if (values.title === '' || values.password === '') {
                return Swal.fire({
                    title: 'Error!',
                    text: 'Please fill out the fields.',
                    icon: 'error',
                    showConfirmButton: false,
                    showCloseButton: true,
                    closeButtonHtml: '&times;',
                    timer: 1500,
                });
            }
            Axios.post(`http://localhost:3001/updatelogin/${values.id}`, {
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
                    closeButtonHtml: '&times;',
                    timer: 5000
                }).then((result) => {
                    props.onChange(values);
                });
            });
        },
        deleteItem() {
            Axios.delete(`http://localhost:3001/deletelogin/${values.id}`)
                .then(() => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Account has been removed from your vault.',
                        icon: 'success',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: 'true',
                        closeButtonHtml: '&times;',
                        timer: 5000
                    }).then((result) => {
                        window.location.reload();
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
                <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                <OutlinedInput
                    id="outlined-username"
                    label="Username"
                    value={values.username}
                    onChange={handleChange('username')}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="copy input"
                                onClick={() => navigator.clipboard.writeText(values.username)}
                                edge="end"
                            >
                                <ContentCopyRoundedIcon />
                            </IconButton>
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
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                            >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            <IconButton
                                aria-label="copy input"
                                onClick={() => navigator.clipboard.writeText(values.password)}
                                edge="end"
                            >
                                <CheckCircleOutlineRoundedIcon />
                            </IconButton>
                            <IconButton
                                aria-label="copy input"
                                onClick={() => navigator.clipboard.writeText(values.password)}
                                edge="end"
                            >
                                <ContentCopyRoundedIcon />
                            </IconButton>
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
                            <IconButton
                                aria-label="copy input"
                                onClick={() => navigator.clipboard.writeText(values.website)}
                                edge="end"
                            >
                                <ContentCopyRoundedIcon />
                            </IconButton>
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

            <Box sx={{ width: '100%', mb: 3 }}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs>
                        <Typography id="masterpassword-re">
                            Master Password Re-prompt?
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Checkbox
                            checked={values.prompt}
                            onChange={handlePromptChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
});

export default SafeLogin;