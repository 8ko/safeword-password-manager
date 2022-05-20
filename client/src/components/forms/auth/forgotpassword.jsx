import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";

import { Typography } from '@mui/material';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

//implement? send otp instead

const ForgotPassword = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [email]);

    return (
        <>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Box sx={{ mr: 2 }}>
                <form /*onSubmit={handleSubmit}*/>
                    <Typography variant="h4"
                        sx={{ textAlign: 'center' }}>
                        Forgot Password
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 0.5 }}>
                        <AlternateEmailIcon sx={{ color: 'action.active', mr: 2, my: 0.5 }} />
                        <TextField
                            required
                            id="email"
                            value={email}
                            ref={userRef}
                            autoComplete="off"
                            placeholder="user@email.com"
                            label="Email"
                            variant="standard"
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            InputLabelProps={{ required: false }}
                        />
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2.5, }}>
                        <Button type="submit" color="primary" variant="outlined">
                            Send Confirmation
                        </Button>
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="overline" >
                            <Link to="/login" style={{ textDecoration: 'none' }}>Back to login</Link>
                        </Typography>
                    </Box>

                </form>
            </Box>

        </>
    )
}

export default ForgotPassword;