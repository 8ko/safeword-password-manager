import React from 'react';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const VaultList = ({list, icon}) => {
    return (
        <>
          <List
              aria-labelledby="nested-list-subheader"
              subheader={
              <ListSubheader style={{fontSize: '0.9rem', letterSpacing: 0.5, marginBottom: -10}} component="div" id="nested-list-subheader">
                  <Typography variant="overline">Logins</Typography>
              </ListSubheader>
              }
          >
              {list.map((val, key) => (
              <ListItem key={val.id} disablePadding>
                  <ListItemButton>
                  <ListItemIcon>
                      {icon}
                  </ListItemIcon>
                  <ListItemText primary={val.title} />
                  </ListItemButton>
              </ListItem>
              ))}
          </List>
        </>
    );
  };

  export default VaultList;