import React from "react";
import { useState, useEffect } from 'react';

import Axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';

const AddItem = () => {

  const [passwordList, setPasswordList] = useState([]);

  const [values, setValues] = React.useState({
    title: '',
    username: '',
    password: '',
    website: '',
    note: '',
    showPassword: false,
  });

  const handleChange = (props) => (event) => {
    event.preventDefault();
    setValues({ ...values, [props]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/showpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    var title = values.title;
    var password = values.password;
    if (title !== '' || password !== '') {
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
      }).then((result) => {
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
    <>
      <h2>Add Item</h2>
      <Box
        component="form"
        noValidate
        autoComplete="on"
        sx={{ mb: 1.5 }}
      >
        <TextField
          id="outlined-helperText"
          label="Name"
          value={values.title}
          onChange={handleChange('title')}
          style ={{minWidth: '25%', width: '95%'}} />
      </Box>

      <Box>
        <TextField
          fullWidth
          label="Username"
          value={values.username}
          onChange={handleChange('username')}
          id="outlined-end-adornment"
          position="end"
          sx={{ mb: 1.5 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                aria-label="copy input"
                onClick={() => navigator.clipboard.writeText(values.username)}
                edge="end"
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </InputAdornment>,
          }}
          style ={{minWidth: '25%', width: '95%'}} />
      </Box>

      <FormControl sx={{ mb: 1.5 }}
      style ={{minWidth: '25%', width: '95%'}} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
                sx={{ pr: 1.5 }}
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              <CheckCircleOutlineRoundedIcon />
              <IconButton
                aria-label="copy input"
                onClick={() => navigator.clipboard.writeText(values.password)}
                edge="end"
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Password" />
      </FormControl>

      <FormControl sx={{ mb: 1.5 }}
      style ={{minWidth: '25%', width: '95%'}} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Website</InputLabel>
        <OutlinedInput
          id="outlined-helperText"
          label="Website"
          value={values.website}
          onChange={handleChange('website')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="copy input"
                onClick={() => navigator.clipboard.writeText(values.website)}
                edge="end"
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </InputAdornment>
          }
          />
      </FormControl>

      <Box>
        <TextField
          label="Note"
          id="outlined-end-adornment"
          position="end"
          placeholder="Note"
          multiline
          rows={3}
          style={{minWidth: '25%', width: '95%'}}
          sx= {{ mb: 1.5 }}
        />
      </Box>

      <Button variant="contained" onClick={addPassword}>
        Add Item
      </Button>

      <div className="Passwords w-50 d-flex">
        {passwordList.map((val, key) => {
          return (
            <div className="container-fluid">
              <div className="row text-white ">
                <div className="col-8 px-0">
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
    </>
  );
};

export default AddItem;