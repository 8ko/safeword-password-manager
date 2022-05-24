import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
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
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Sidebar = (width) => {

    const { auth, setAuth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const [loginList, setLoginList] = useState([]);
    const [cardList, setCardList] = useState([]);
    const [noteList, setNoteList] = useState([]);

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    
    const user = decoded?.id || 0;

    useEffect(() => {
        const getItems = async () => {
            try {
                await axiosPrivate.post('/showlogins', {user}).then((res) => {
                    setLoginList(res.data);
                });
                await axiosPrivate.post('/showcards', {user}).then((res) => {
                    setCardList(res.data);
                });
                await axiosPrivate.post('/shownotes', {user}).then((res) => {
                    setNoteList(res.data);
                });
            } catch (err) {
                setAuth({});
                navigate('/login', { state: { from: location }, replace:true });
            }
        }
        getItems();
    }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

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
                <VaultList title="Logins" type={VaultItemTypes.Login} list={loginList} icon={<LanguageRoundedIcon />} />
                <Divider />
                <VaultList title="Cards" type={VaultItemTypes.Card} list={cardList} icon={<CreditCardIcon />} />
                <Divider />
                <VaultList title="Notes" type={VaultItemTypes.Note} list={noteList} icon={<ArticleRoundedIcon />} />
                </Box>
            </Drawer>
        </>
    );
}

export default Sidebar;