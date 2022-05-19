import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

import Axios from 'axios';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

import SafeLogin from '../components/forms/safelogin';
import SafeCard from '../components/forms/safecard';
import SafeNote from '../components/forms/safenote';

import { VaultItemTypes } from '../constants';

const Vault = (props) => {

    const navigate = useNavigate();

    const child = useRef();

    const location = useLocation();
    const state = location.state || {};

    const [defaultItem, setDefaultItem] = useState([]);
    const [lastItem, setLastItem] = useState([]);
    const [didDelete, setDidDelete] = useState(false);

    useEffect(() => {
        // get first item in vault if user came from different page
        if (!state.data) {
            Axios.get("http://localhost:3001/showlogins").then((res) => {
                if (res.data.length > 0) {
                    setDefaultItem({...res.data[0], type: VaultItemTypes.Login});
                } else {
                    Axios.get("http://localhost:3001/showcards").then((res) => {
                        if (res.data.length > 0) {
                            setDefaultItem({...res.data[0], type: VaultItemTypes.Card});
                        } else {
                            Axios.get("http://localhost:3001/shownotes").then((res) => {
                                if (res.data.length > 0) {
                                    setDefaultItem({...res.data[0], type: VaultItemTypes.Note});
                                }
                            });
                        }
                    });
                }
            });
        }
    }, [state.data]);
    
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
            type = defaultItem.type;
        }

        if (type === VaultItemTypes.Login) {
            return <SafeLogin ref={child} prop1={data} onUpdate={handleUpdate} onDelete={handleDelete} />
        } else if (type === VaultItemTypes.Card) {
            return <SafeCard ref={child} prop1={data} onUpdate={handleUpdate} onDelete={handleDelete} />
        } else if (type === VaultItemTypes.Note) {
            return <SafeNote ref={child} prop1={data} onUpdate={handleUpdate} onDelete={handleDelete} />
        } else {
            navigate('/emptyvault');
        }
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <h2>Vault</h2>
            </Box>
            { safeForm() }
            <Stack direction="row" spacing={1.5}>
                <Button variant="outlined" onClick={() => child.current.updateItem()} startIcon={<UpdateRoundedIcon />}>
                    Update
                </Button>
                <Button variant="outlined" color="error" onClick={() => child.current.deleteItem()} startIcon={<DeleteRoundedIcon />}>
                    Delete
                </Button>
            </Stack>
        </>
    );
}

export default Vault;