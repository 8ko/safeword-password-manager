import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';

const VerifiedEmail = () => {
    return (
        <>
            <div style={{ textAlign: 'center', marginTop: 4, color: '#757575', width: '90%' }}>
                <Box sx={{ ml: 1 }}>
                    <VerifiedUserRoundedIcon sx={{ mb: 2, fontSize: 200 }} />
                    <Typography style={{ textAlign: 'center' }} sx={{ mb: 2 }} variant="h3">
                        Your email was successfully verified.
                    </Typography>
                    <Typography variant="caption">
                        You will now be redirected to your vault. Click <Link to="/">here</Link> if you are not redirected automatically.
                    </Typography>
                </Box>
            </div>
        </>
    );
};

export default VerifiedEmail;