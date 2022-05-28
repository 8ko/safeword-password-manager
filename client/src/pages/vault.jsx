import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
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
            setDefaultItem(
                vault?.logins?.length ? { ...vault.logins[0], type: VaultItemTypes.Login } :
                vault?.cards?.length ? { ...vault.cards[0], type: VaultItemTypes.Cards } :
                vault?.notes?.length ? { ...vault.notes[0], type: VaultItemTypes.Notes } :
                undefined
            );
        }
    },[vault]) // eslint-disable-line react-hooks/exhaustive-deps

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
                    <Button sx={{ display: 'flex', alignItems: 'flex-start' }} variant="outlined" color="error" onClick={() => child.current.deleteItem()} startIcon={<DeleteRoundedIcon />}>
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
        <>{ ((defaultItem || state.data) && !didDelete) ? showVaultItem() : <EmptyVault /> }</>
    )
}

export default Vault;