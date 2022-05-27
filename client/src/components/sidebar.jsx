import React from 'react';
import { useEffect } from 'react';
import jwt_decode from "jwt-decode";

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';

import VaultList from './vaultlist';
import { VaultItemTypes } from '../constants';

import useAuth from '../hooks/useAuth';
import useVault from '../hooks/useVault';
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Sidebar = (width) => {

    const { auth } = useAuth();
    const { vault, setVault } = useVault();
    const axiosPrivate = useAxiosPrivate();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const user = decoded?.id || 0;

    useEffect(() => {
        let isMounted = true;
        const getData = async () => {
            if (isMounted) {
                await axiosPrivate.get(`/vault/${user}`).then((res) => {
                    setVault(res.data);
                });
            }
        };
        getData();
        return () => isMounted = false;
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Drawer
                variant="permanent"
                sx={{
                width: width,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: width, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                <VaultList title="Logins" type={VaultItemTypes.Login} list={vault?.logins || []} icon={<LanguageRoundedIcon />} />
                <Divider />
                <VaultList title="Cards" type={VaultItemTypes.Card} list={vault?.cards || []} icon={<CreditCardIcon />} />
                <Divider />
                <VaultList title="Notes" type={VaultItemTypes.Note} list={vault?.notes || []}icon={<ArticleRoundedIcon />} />
                </Box>
            </Drawer>
        </>
    );
}

export default Sidebar;