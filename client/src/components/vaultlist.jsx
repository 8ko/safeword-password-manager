import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const VaultList = ({ title, type, list, icon }) => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const handleClick = (data) => {
        if (data.prompt) {
            Swal.fire({
                title: 'Password Reprompt',
                input: 'password',
                inputPlaceholder: '************',
                text: 'Enter your master password to proceed:',
                showConfirmButton: true,
                confirmButtonColor: '#318ce7',
                confirmButtonText: 'Confirm',
                showCancelButton: true,
            }).then((result) => {
                if (!result.isDismissed) {
                    axiosPrivate.post('/decryptpassword', {
                        password: data.password,
                        iv: data.iv,
                    }).then((res) => {
                        console.log(res.data);
                        if (res.data == result.value) {
                            navigate('/', { state: { data } });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'Incorrect master password.',
                                icon: 'error',
                                confirmButtonColor: '#318ce7',
                                confirmButtonText: 'Okay',
                                showCloseButton: true,
                                closeButtonHtml: '&times;',
                            });
                        }
                    });
                }
            });
        } else {
            navigate('/', { state: { data } });
        }
    }

    return (
        <>
            <List
                disablePadding
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader style={{ fontSize: '0.9rem', letterSpacing: 0.5, marginBottom: -10 }} component="div" id="nested-list-subheader">
                        <Typography variant="overline">{title}</Typography>
                    </ListSubheader>
                }
            >
                {list.map((data, key) => (
                    <ListItem
                        key={data.id}
                        onClick={() => handleClick({ ...data, type: type })}
                        disablePadding
                        disableGutters
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={data.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default VaultList;