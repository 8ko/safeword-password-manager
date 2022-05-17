import React from "react";

import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MailIcon from '@mui/icons-material/Mail';

const Sidebar = (width) => {
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
                <List
                    aria-labelledby="nested-list-subheader"
                    subheader={
                    <ListSubheader style={{fontSize: '0.9rem', letterSpacing: 0.5, marginBottom: -10}} component="div" id="nested-list-subheader">
                        <Typography variant="overline">Logins</Typography>
                    </ListSubheader>
                    }
                >
                    {['Mail', 'Facebook', 'Instagram', 'Twitter'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                <Divider />
                <List
                    aria-labelledby="nested-list-subheader"
                    subheader={
                    <ListSubheader style={{fontSize: '0.9rem', letterSpacing: 0.5, marginBottom: -10}} component="div" id="nested-list-subheader">
                        <Typography variant="overline">Cards</Typography>
                    </ListSubheader>
                    }
                >
                    {['VISA', 'AmEx', 'MasterCard'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                    ))}
                </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Sidebar;