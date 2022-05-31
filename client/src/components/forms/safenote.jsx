import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

import { VaultItemTypes } from '../../constants';
import validateSafeForm from './validateSafeForm';

import useAuth from '../../hooks/useAuth';
import useVault from '../../hooks/useVault';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ADD_URL = '/addnote';
const UPDATE_URL = '/updatenote';
const DELETE_URL = '/deletenote';

const SafeNote = forwardRef((props, ref) => {

    const { auth } = useAuth();
    const { vault, setVault } = useVault();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [values, setValues] = React.useState({
        type: 0,
        id: 0,
        title: '',
        note: '',
        prompt: false
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

    useEffect(() => {
        if (props.prop1) {
            setValues({
                type: props.prop1.type || 0,
                id: props.prop1.id || 0,
                title: props.prop1.title || '',
                note: props.prop1.note || '',
                prompt: Boolean(props.prop1.prompt) || false
            });
        }
    }, [props]);

    useImperativeHandle(ref, () => ({
        addItem() {
            var err = '';
            if (Object.keys(err = validateSafeForm(values, VaultItemTypes.Note)).length) {
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
                note: values.note,
                prompt: values.prompt
            }).then(res => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Note has been added to your vault.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: true,
                    closeButtonHtml: '&times;'
                }).then(() => {
                    const data = { ...res.data, type: VaultItemTypes.Note };
                    vault.notes.push(data);
                    navigate('/', { state: { data } });
                });
            });
        },

        updateItem() {
            var err = '';
            if (Object.keys(err = validateSafeForm(values, VaultItemTypes.Note)).length) {
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
                note: values.note,
                prompt: values.prompt
            }).then((res) => {
                Swal.fire({
                    title: 'Success!',
                    text: 'Note has been updated.',
                    icon: 'success',
                    confirmButtonColor: '#318ce7',
                    confirmButtonText: 'Okay',
                    showCloseButton: 'true',
                    closeButtonHtml: '&times;'
                }).then(() => {
                    const data = { ...res.data, type: VaultItemTypes.Note };
                    setVault({...vault, notes: vault.notes.map((item) => (item.id === values.id ? res.data : item))});
                    navigate('/', { state: { data } });
                });
            });
        },

        deleteItem() {
            axiosPrivate.delete(`${DELETE_URL}/${values.id}`)
                .then(() => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Note has been removed from your vault.',
                        icon: 'success',
                        confirmButtonColor: '#318ce7',
                        confirmButtonText: 'Okay',
                        showCloseButton: 'true',
                        closeButtonHtml: '&times;'
                    }).then((result) => {
                        props.onDelete();
                        setVault({...vault, notes: vault.notes.filter((item) => item.id !== values.id )});
                    });
                });
        },
    }))

    return (
        <>
            <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ mb: 1.5 }}
            >
                <TextField
                    fullWidth
                    id="outlined-name"
                    label="Name"
                    value={values.title}
                    onChange={handleChange('title')}
                />
            </Box>

            <Box sx={{ mb: 1.5 }}>
                <TextField
                    label="Note"
                    id="outlined-end-adornment"
                    position="end"
                    placeholder="Note"
                    multiline
                    rows={3}
                    style={{ minWidth: '25%', width: '100%' }}
                    value={values.note}
                    onChange={handleChange('note')}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <Tooltip title="Copy">
                                    <IconButton
                                        aria-label="copy input"
                                        onClick={() => navigator.clipboard.writeText(values.note)}
                                        edge="end"
                                    >
                                        <ContentCopyRoundedIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

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

export default SafeNote;
