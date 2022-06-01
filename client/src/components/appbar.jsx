import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { styled, alpha } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import useVault from '../hooks/useVault';
import { VaultItemTypes } from '../constants';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import safeword from '../safeword';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
}));

const Appbar = () => {
  const { auth } = useAuth();
  const { vault } = useVault();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const vaultKey = localStorage.getItem('vaultKey');

  const decoded = auth?.accessToken
      ? jwt_decode(auth.accessToken)
      : undefined;
  const user = decoded?.id || 0;
  
  const [data, setData] = useState([]);

  useEffect(() => {
    var arr = [];
    vault?.logins?.map((item) => {
      return arr.push({...item,type:VaultItemTypes.Login});
    })
    vault?.cards?.map((item) => {
      return arr.push({...item,type:VaultItemTypes.Card});
    })
    vault?.notes?.map((item) => {
      return arr.push({...item,type:VaultItemTypes.Note});
    })
    setData(arr);
  },[vault])

  const openVaultItem = (title) => {
    if (!title) return;
    const item = data.find((item)=>item.title === title);
    if (!item) {
      return Swal.fire({
        title: 'Not Found',
        text: 'No such item found in your vault.',
        icon: 'error',
        confirmButtonColor: '#318ce7',
        confirmButtonText: 'Okay',
        showCloseButton: true,
        closeButtonHtml: '&times;',
      });
    }
    if (!item.prompt) return navigate('/', { state: { data:item } });
    Swal.fire({
      title: 'Password Reprompt',
      input: 'password',
      inputPlaceholder: '************',
      text: 'Enter your master password to proceed:',
      showConfirmButton: true,
      confirmButtonColor: '#318ce7',
      confirmButtonText: 'Confirm',
      showCancelButton: true,
    }).then(async (result) => {
      if (!result.isDismissed) {
        const authPwd = await safeword.hash(vaultKey + result.value);
        await axiosPrivate.post('/reprompt', {
            user: user,
            pwd: authPwd
        }).then(res => {
          navigate('/', { state: { data:item } });
        }).catch(err => {
          Swal.fire({
            title: 'Error',
            text: 'Incorrect master password.',
            icon: 'error',
            confirmButtonColor: '#318ce7',
            confirmButtonText: 'Okay',
            showCloseButton: true,
            closeButtonHtml: '&times;',
          });
        });
      }
    });
  }

  const handleOnSearch = (event, value) => {
    openVaultItem(value);
  }

  const handleSubmit = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      openVaultItem(e.target.value);
    }
  }

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar disableGutters>
          <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            sx={{ mx: 1 }}
          >
            <img src={process.env.PUBLIC_URL + "/SafeLogo34Full.png"} alt="SafeLogo" />
          </IconButton>

          <Search sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}>
            <Autocomplete
              freeSolo
              noOptionsText="Vault is empty"
              id="searchbar"
              onChange={handleOnSearch}
              options={data.map((option) => option.title)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  sx={{ input: { color: grey['A200'] } }}
                  placeholder="Search vault"
                  onKeyDown={handleSubmit}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{mx:1}}>
                        <SearchIcon sx={{ color: grey['A200'] }} />
                      </InputAdornment>
                    ),
                    disableUnderline: true
                  }}
                />
              )}
            />
          </Search>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="add to vault"
            sx={{ ml: 0.5 }}
            component={Link}
            to="/additem"
          >
            <AddCircleRoundedIcon style={{ fontSize: "30px" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Appbar;