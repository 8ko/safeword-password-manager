import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

import Axios from 'axios';

import Box from '@mui/material/Box';

const Vault = (props) => {

    const location = useLocation();
    const state = location.state || {};

    const [defaultItem, setDefaultItem] = useState([]);
    const [defaultType, setDefaultType] = useState(0);

    useEffect(() => {
        if (state.data) return;
        Axios.get("http://localhost:3001/showlogins").then((res) => {
            if (res.data.length > 0) {
                setDefaultType(1);
                setDefaultItem(res.data[0]);
                return;
            } else {
                Axios.get("http://localhost:3001/showcards").then((res) => {
                    if (res.data.length > 0) {
                        setDefaultType(2);
                        setDefaultItem(res.data[0]);
                        return;
                    } else {
                        Axios.get("http://localhost:3001/shownotes").then((res) => {
                            if (res.data.length > 0) {
                                setDefaultType(3);
                                setDefaultItem(res.data[0]);
                                return;
                            }
                        });
                    }
                });
            }
        });
    }, []);

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <h2>Vault</h2>
            </Box>
        </>
    );
}

export default Vault;