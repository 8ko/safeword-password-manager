import * as React from 'react';
import "./App.css";
import { useState, useEffect } from 'react';
import Axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import MailIcon from '@mui/icons-material/Mail';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import SettingsIcon from '@mui/icons-material/Settings';

import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const drawerWidth = 220;
  
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

  useEffect(() => {
    Axios.get("http://localhost:3001/showpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    var title=document.getElementById('title').value;
    var password=document.getElementById('password').value;
    if (title!=='' || password!==''){
      console.log("hello");
      Axios.post("http://localhost:3001/addpassword", {
        password: password,
        title: title,
      });
      console.log("Password added");
      // title = '';
      // password = '';
      
      Swal.fire({
        title: 'Success!',
        text: 'Password has been added to your vault.',
        icon: 'success',
        // showConfirmButton: false,
        confirmButtonColor: '#318ce7',
        confirmButtonText: 'Okay',
        showCloseButton: true,
        closeButtonHtml: '&times;',
        timer: 5000
      }).then((result) =>{
        window.location.reload();
      });

    } else {
      console.log('empty');
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out the fields.',
        icon: 'error',
        showConfirmButton: false,
        showCloseButton: true,
        closeButtonHtml: '&times;',
        timer: 1500
      });
    }
    
  };

  const deletePassword = () => {
    Axios.delete()
    // Axios.post("http://localhost:3001/deletepassword", {
    //   password: password,
    //   title: title,
    // });
    console.log("Password deleted");

    // Swal.fire({
    //   title: 'Success!',
    //   text: 'Password has been removed from your vault.',
    //   icon: 'success',
    //   confirmButtonColor: '#318ce7',
    //   confirmButtonText: 'Okay',
    //   showCloseButton: 'true',
    //   closeButtonHtml: '&times;',
    // }).then((result) =>{
    //   window.location.reload();
    // });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
              id: val.id,
              password: val.password,
              title: response.data,
              iv: val.iv,
            }
            : val;
        })
      );
    });
  };

  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
        <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2 }}
          >
            SafeWord
          </Typography>
          <Search sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase 
              placeholder="Search vault…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="add to vault"
            sx={{ ml: 2 }}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List
          aria-labelledby="nested-list-subheader"
          subheader={
           <ListSubheader component="div" id="nested-list-subheader">
           Accounts
          </ListSubheader>
          }
        >
            {['Mail','Facebook', 'Instagram', 'Twitter'].map((text, index) => (
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
           <ListSubheader component="div" id="nested-list-subheader">
           Cards
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
          Convallis convallis tellus id interdum velit laoreet id donec ultrices.
          Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
          nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
          leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
          feugiat vivamus at augue. At augue eget arcu dictum varius duis at
          consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
          sapien faucibus et molestie ac.
        </Typography>
      </Box>
    </Box>
    
    <Paper sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
    <Divider />
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Vault" icon={<LockRoundedIcon />} />
          <BottomNavigationAction label="Generator" icon={<CachedRoundedIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>

      <div className="AddingPassword">
        <div className="SafewordLogo">
        <p>Safe<mark>Word</mark></p>
        </div>
        <input
          type="text"
          id="password"
          placeholder="Ex. password123"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input 
          type="text"
          id="title"
          placeholder="Ex. Facebook"
          onChange={(event) => {
            setTitle(event.target.value);
          }}z
        />
        <button onClick={addPassword}> Add Password </button></div>

      <div className="Passwords w-50 d-flex">
        {passwordList.map((val, key) => {
          return (
            <div className="container-fluid">
              <div className="row text-white ">
                <div className="col-8">
                  <div
                    className="password w-100 h-75 rounded"
                    onClick={() => {
                      decryptPassword({
                        password: val.password,
                        iv: val.iv,
                        id: val.id,
                      });
                    }}
                    key={key}
                  >
                    <h3>{val.title}</h3> 
                  </div>
                </div>
                <div className="col w-100">
                  <div className="view h-75 rounded">
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                  </div>
                </div>
                <div className="col w-100">
                  <div className="del h-75 rounded">
                    <FontAwesomeIcon onClick={deletePassword} icon={faTrash}></FontAwesomeIcon>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
