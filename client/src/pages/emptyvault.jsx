import React from 'react';

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
                    Click + to add an item
                </Typography>
            </div>

        </>
    );
};

export default EmptyVault;