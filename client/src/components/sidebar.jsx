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
import safeword from '../safeword';

const Sidebar = (width) => {

    const { auth } = useAuth();
    const { vault, setVault } = useVault();
    const axiosPrivate = useAxiosPrivate();
    const vaultKey = localStorage.getItem('vaultKey');

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    const user = decoded?.id || 0;

    useEffect(() => {
        let isMounted = true;
        const getData = async () => {
            await axiosPrivate.get(`/${user}`).then((res) => {
                const logins = [], cards = [], notes = [];
                res.data.forEach((item) => {
                    try {
                        if (item.data) {
                            const blob = Buffer.from(item.data).toString();
                            const decrypted = JSON.parse(safeword.decrypt(blob, vaultKey));
                            const data = { ...item, ...decrypted };
                            
                            if (data.type === VaultItemTypes.Login) {
                                logins.push(data);
                            } else if (data.type === VaultItemTypes.Card) {
                                cards.push(data);
                            } else if (data.type === VaultItemTypes.Note) {
                                notes.push(data);
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                })
                setVault({ logins, cards, notes });
            });
        };
        if (isMounted) getData();
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
                <Toolbar />
            </Drawer>
        </>
    );
}

export default Sidebar;