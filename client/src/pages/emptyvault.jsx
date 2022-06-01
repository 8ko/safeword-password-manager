import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

const EmptyVault = () => {
    return (
        <>
            <div className="d-flex flex-column align-self-center align-items-center mt-2"
            style={{ color: '#757575' }}
            >
                <SentimentVeryDissatisfiedRoundedIcon style={{ fontSize: 200 }} />
                <Typography style={{ textAlign: 'center' }} variant="h3">
                    YOUR VAULT IS EMPTY
                </Typography>
                <Typography variant="overline">
                    Click + to <Link to="/additem" style={{ textDecoration: 'none' }}>add an item</Link>
                </Typography>
            </div>
        </>
    );
};

export default EmptyVault;