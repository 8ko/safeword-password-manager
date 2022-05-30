import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { format } from 'date-fns';
import Swal from 'sweetalert2';

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

import useVault from '../hooks/useVault';

const Vault = () => {
    const { vault } = useVault();
    const child = useRef();
    const location = useLocation();
    const state = location.state || {};

    const [didDelete, setDidDelete] = useState(false);
    const [defaultItem, setDefaultItem] = useState();
    
    useEffect(() => {
        if (!state.data) {
            var item;
            if (vault?.logins?.length) {
                item = vault.logins.find(e => !e.prompt);
                if (item) setDefaultItem({...item,type:VaultItemTypes.Login});
            }
            if (!item && vault?.cards?.length) {
                item = vault.cards.find(e => !e.prompt);
                if (item) setDefaultItem({...item,type:VaultItemTypes.Card});
            }
            if (!item && vault?.notes?.length) {
                item = vault.notes.find(e => !e.prompt);
                if (item) setDefaultItem({...item,type:VaultItemTypes.Note});
            }
        }
    },[vault]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setDidDelete(false);
    },[state.data])

    const handleDelete = () => {
        Swal.fire({
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete?',
            icon: 'warning',
            confirmButtonColor: '#318ce7',
            confirmButtonText: 'Yes',
            showCloseButton: true,
            closeButtonHtml: '&times;',
            showCancelButton: true,
        }).then((result) => {
            if (!result.isDismissed) {
                child.current.deleteItem();
            }
        });
    }

    const safeForm = () => {
        var data = {};

        if (state.data && !didDelete) {
            data = state.data;
        } else if (!didDelete) {
            data = defaultItem;
        }

        if (data.type === VaultItemTypes.Login) {
            return <SafeLogin ref={child} prop1={data} onDelete={() => setDidDelete(true)} />
        } else if (data.type === VaultItemTypes.Card) {
            return <SafeCard ref={child} prop1={data} onDelete={() => setDidDelete(true)} />
        } else if (data.type === VaultItemTypes.Note) {
            return <SafeNote ref={child} prop1={data} onDelete={() => setDidDelete(true)} />
        } else {
            return <></>
        }
    }

    const getLastUpdate = () => {
        var data = {};
        if (state.data && !didDelete) {
            data = state.data;
        } else if (!didDelete) {
            data = defaultItem;
        }
        if (!data?.updated_at) return '';
        return format(new Date(String(data.updated_at)), 'MMM dd, yyyy, hh:mm:ss a');
    }

    const showVaultItem = () => {
        return (
            <>
                <Box sx={{ mb: 4 }}>
                    <h2>Item Information</h2>
                </Box>
                { safeForm() }
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" onClick={() => child.current.updateItem()} startIcon={<UpdateRoundedIcon />}>
                        Update
                    </Button>
                    <Button sx={{ display: 'flex', alignItems: 'flex-start' }} variant="outlined" color="error" onClick={handleDelete} startIcon={<DeleteRoundedIcon />}>
                        Delete
                    </Button>
                </Stack>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption">
                        Updated: { getLastUpdate() }
                    </Typography>
                </Box>
            </>
        )
    }

    return (
        <>
            {
                ((defaultItem || state.data) && !didDelete)
                ? showVaultItem() 
                : didDelete || !defaultItem
                ? <></>
                : <EmptyVault />
            }
        </>
    )
}

export default Vault;