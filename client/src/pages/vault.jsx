import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { format } from 'date-fns';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import { VaultItemTypes } from '../constants';
import SafeLogin from '../components/forms/safelogin';
import SafeCard from '../components/forms/safecard';
import SafeNote from '../components/forms/safenote';
import EmptyVault from './emptyvault';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Vault = (props) => {

    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const child = useRef();
    const location = useLocation();
    const state = location.state || {};

    const [defaultItem, setDefaultItem] = useState([]);
    const [lastItem, setLastItem] = useState([]);
    const [didDelete, setDidDelete] = useState(false);

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;

    const user = decoded?.id || 0;

    useEffect(() => {
        // get first item in vault if user came from different page
        const getFirstItems = async () => {
            try {
                axiosPrivate.post('/showlogins', { user }).then((res) => {
                    if (res.data.length > 0) {
                        setDefaultItem({ ...res.data[0], type: VaultItemTypes.Login });
                    } else {
                        axiosPrivate.post('/showcards', { user }).then((res) => {
                            if (res.data.length > 0) {
                                setDefaultItem({ ...res.data[0], type: VaultItemTypes.Card });
                            } else {
                                axiosPrivate.post('/shownotes', { user }).then((res) => {
                                    if (res.data.length > 0) {
                                        setDefaultItem({ ...res.data[0], type: VaultItemTypes.Note });
                                    }
                                });
                            }
                        });
                    }
                });
            } catch (err) {
                setAuth({});
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        if (!state.data) {
            getFirstItems();
        }
    }, [state.data, auth.id]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleUpdate(data) {
        setLastItem(data);
    }

    function handleDelete() {
        setDidDelete(true);
        // dirty trick to select first item in vault after deleting
        navigate('/emptyvault');
        navigate('/');
    }

    const safeForm = () => {
        var data = [];
        var type = 0;

        if (state.data && !didDelete) {
            data = state.data.id === lastItem.id ? lastItem : state.data;
            type = state.data.type;
        } else {
            data = defaultItem;
            type = defaultItem?.type || 0;
        }

        if (type === VaultItemTypes.Login) {
            return <SafeLogin ref={child} prop1={data} onUpdate={handleUpdate} onDelete={handleDelete} />
        } else if (type === VaultItemTypes.Card) {
            return <SafeCard ref={child} prop1={data} onUpdate={handleUpdate} onDelete={handleDelete} />
        } else if (type === VaultItemTypes.Note) {
            return <SafeNote ref={child} prop1={data} onUpdate={handleUpdate} onDelete={handleDelete} />
        } else {
            return <EmptyVault />;
        }
    }

    const getLastUpdate = () => {
        var data = [];
        if (state.data && !didDelete) {
            data = state.data.id === lastItem.id ? lastItem : state.data;
        } else {
            data = defaultItem;
        }
        if (!data?.updated_at) return '';
        return format(new Date(String(data.updated_at)), 'MMM dd, yyyy, h:i:s a');
    }

    return (
        <>
            {
                (defaultItem.length || lastItem.length || state.data) && (
                    <Box sx={{ mb: 4 }}>
                        <h2>Item Information</h2>
                    </Box>
                )
            }
            {safeForm()}
            {
                (defaultItem.length || lastItem.length || state.data) && (
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" onClick={() => child.current.updateItem()} startIcon={<UpdateRoundedIcon />}>
                            Update
                        </Button>
                        <Button sx={{ display: 'flex', alignItems: 'flex-start' }} variant="outlined" color="error" onClick={() => child.current.deleteItem()} startIcon={<DeleteRoundedIcon />}>
                            Delete
                        </Button>
                    </Stack>
                )
            }
            {
                (defaultItem.length || lastItem.length || state.data) && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption">
                            Updated: {getLastUpdate()}
                        </Typography>
                    </Box>
                )
            }
        </>
    );
}

export default Vault;