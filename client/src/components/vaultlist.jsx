import React from 'react';
import { useNavigate } from 'react-router-dom';

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const VaultList = ({title, type, list, icon}) => {
    
    const navigate = useNavigate();
    const handleClick = (data) => {
        navigate('/', { state: { data }});
    }

    return (
        <>
          <List
              aria-labelledby="nested-list-subheader"
              subheader={
              <ListSubheader style={{fontSize: '0.9rem', letterSpacing: 0.5, marginBottom: -10}} component="div" id="nested-list-subheader">
                  <Typography variant="overline">{title}</Typography>
              </ListSubheader>
              }
          >
              {list.map((data, key) => (
              <ListItem
                    key={data.id}
                    onClick={()=>handleClick({...data, type: type})}
                    disablePadding
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