import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const FAQ = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ textAlign: 'center', overflowY: 'hidden' }}>
            <Box sx={{ mb: 1 }}>
                <Typography variant="h5">Frequently Asked Questions</Typography>
            </Box>
            <Divider />
            <Box sx={{
                mt: 2,
                width: '95%',
                height: 300,
                overflow: 'auto',
                p: 2,
                textAlign: 'justify',
            }}>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    What is SafeWord?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    SafeWord is a password manager extension for Google Chrome. It offers tools such as password generation, organized profiles, and end-to-end encryption. All the sensitive information will be stored securely in an encrypted form without requiring users to remember all of their passwords.
                </Typography>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    How does SafeWord work?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    SafeWord works by requiring the user to register an account containing their email, name, and a Master Password. It will send a verfication before the user can proceed to the password Manager. It allows the user to edit, add, and delete data on their vault.
                </Typography>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    Can the developers see the passwords users save?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    No, all sensitive information are stored in encrypted form. The master password is hashed via Bcrypt. For more information, please read the <Link to="/privacy" style={{ textDecoration: 'none' }}>Privacy Policy</Link>.
                </Typography>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    Is anything logged when I verify security for emails and passwords?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    Nothing is explicitly logged by the extension. Separately to the pwned address search feature, the securiy verification service for passwords allows you to check if an individual password has previously been seen in a data breach. No password is stored next to any personally identifiable data (such as an email address).
                </Typography>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    Is SafeWord free?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    Yes, it’s a free Google Chrome extension that you can use to store your sensitive information. Donations are appreciated and will go to the maintenance of SafeWord.
                </Typography>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    What is a "breach" and where has the data come from?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    A "breach" is an incident where data is inadvertently exposed in a vulnerable system, usually due to insufficient access controls or security weaknesses in the software. HIBP aggregates breaches and enables people to assess where their personal data has been exposed. (https://haveibeenpwned.com/FAQs)
                </Typography>
                <Typography paragraph
                    variant="h6"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    What is a "paste"?
                </Typography>
                <Typography paragraph
                    variant="subtitle2"
                    sx={{
                        whiteSpace: 'pre-line',
                        lineHeight: '16px'
                    }}>
                    A "paste" is information that has been "pasted" to a publicly facing website designed to share content such as Pastebin. These services are favoured by hackers due to the ease of anonymously sharing information and they're frequently the first place a breach appears. Finding an email address in a paste does not immediately mean it has been disclosed as the result of a breach. Review the paste and determine if your account has been compromised then take appropriate action such as changing passwords. (https://haveibeenpwned.com/FAQs)
                </Typography>
            </Box>
            <Box sx={{ my: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default FAQ;