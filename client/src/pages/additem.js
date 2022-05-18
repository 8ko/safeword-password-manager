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

import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function AddItem() {
  const [type, setType] = React.useState(1);
  const [typeName, setTypeName] = React.useState('Login');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleClose = event => {
    setTypeName(event.target.innerText);
  }

  const [checked, setChecked] = React.useState(false);
  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <Box sx={{ mb: 4 }}>
        <h2>Add Item to Vault</h2>
      </Box>
      <Box sx={{ mb: 1.5 }}>
        <FormControl fullWidth>
          <InputLabel id="select-type-label">Type</InputLabel>
          <Select
            name="addtype"
            labelId="select-type-label"
            id="select-type"
            value={type}
            label="Type"
            onChange={handleTypeChange}
          >
            <MenuItem onClick={handleClose} value={1}>Login</MenuItem>
            <MenuItem onClick={handleClose} value={2}>Card</MenuItem>
            <MenuItem onClick={handleClose} value={3}>Secure Note</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {
        (type === 1 &&
          <AddLogin />)
        || (type === 2 &&
          <AddCard />)
        || (type === 3 &&
          <AddNote />)
        ||
        <AddLogin />
      }

      <Box sx={{ width: '100%', mb: 3 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Typography id="masterpassword-re">
              Master Password Re-prompt?
            </Typography>
          </Grid>
          <Grid item>
            <Checkbox
              checked={checked}
              onChange={handleCheckChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Grid>
        </Grid>
      </Box>

      <Button variant="contained" onClick={() => { console.log(typeName) }}>
        Add {typeName}
      </Button>
    </div>

  );
};

export function AddLogin() {
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
    var username = values.username;
    var website = values.website;
    var note = values.note;
    if (title !== '' || password !== '') {
      Axios.post("http://localhost:3001/addpassword", {
        type: 1,
        title: title,
        password: password,
        username: username,
        website: website,
        note: note,
      });

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

  const deletePassword = (id) => {
    Axios.delete(`http://localhost:3001/deletepassword/${id}`)
      .then(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Password has been removed from your vault.',
          icon: 'success',
          confirmButtonColor: '#318ce7',
          confirmButtonText: 'Okay',
          showCloseButton: 'true',
          closeButtonHtml: '&times;',
          timer: 5000
        }).then((result) => {
          window.location.reload();
        });
      });
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
      <Box
        component="form"
        noValidate
        autoComplete="on"
        sx={{ mb: 1.5 }}
      >
        <TextField
          id="outlined-title"
          label="Title"
          value={values.title}
          onChange={handleChange('title')}
          style={{ minWidth: '25%', width: '100%' }} />
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
          style={{ minWidth: '25%', width: '100%' }} />
      </Box>

      <FormControl sx={{ mb: 1.5 }}
        style={{ minWidth: '25%', width: '100%' }} variant="outlined">
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
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
              <IconButton
                aria-label="copy input"
                onClick={() => navigator.clipboard.writeText(values.password)}
                edge="end"
              >
                <CheckCircleOutlineRoundedIcon />
              </IconButton>
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
        style={{ minWidth: '25%', width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Website</InputLabel>
        <OutlinedInput
          id="outlined-website"
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

      <FormControl sx={{ mb: 1.5 }}
        style={{ minWidth: '25%', width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Note</InputLabel>
        <OutlinedInput
          id="outlined-note"
          label="Note"
          multiline
          rows={3}
          value={values.note}
          onChange={handleChange('note')}
        />
      </FormControl>

      <Button variant="contained" onClick={addPassword}>
        Add true
      </Button>

      <div className="Passwords w-50 d-flex">
        {passwordList.map((val, key) => {
          return (
            <div key={val.id} className="container-fluid">
              <div className="row text-white ">
                <div className="col-8 px-0">
                  <div
                    className="password h-75 rounded"
                    onClick={() => {
                      decryptPassword({
                        password: val.password,
                        iv: val.iv,
                        id: val.id,
                      });
                    }}
                  >
                    <h3>{val.title}</h3>
                  </div>
                </div>
                <div className="col">
                  <div className="view h-75 rounded">
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                  </div>
                </div>
                <div className="col">
                  <div className="del h-75 rounded" onClick={() => deletePassword(val.id)}>
                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
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

export function AddCard() {
  const [passwordList, setPasswordList] = useState([]);

  const [values, setValues] = React.useState({
    brand: '',
    cardname: '',
    number: '',
    expyr: '',
    cvv: '',
    note: '',
  });

  const handleChange = (props) => (event) => {
    event.preventDefault();
    setValues({ ...values, [props]: event.target.value });
  };

  const [month, setMonth] = React.useState(1);
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="on"
        sx={{ mb: 1.5 }}
      >
        <TextField
          fullWidth
          id="outlined-brand"
          label="Brand"
          placeholder="eg: Visa, MasterCard"
          value={values.brand}
          onChange={handleChange('brand')}
        />
      </Box>

      <Box>
        <TextField
          fullWidth
          label="Name of Cardholder"
          value={values.cardname}
          onChange={handleChange('cardname')}
          sx={{ mb: 1.5 }}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 1.5 }}
        variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Card Number</InputLabel>
        <OutlinedInput
          id="outlined-number"
          label="Card Number"
          type="number"
          value={values.number}
          onChange={handleChange('number')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="copy input"
                onClick={() => navigator.clipboard.writeText(values.number)}
                edge="end"
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Grid container spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="select-month-label">Month</InputLabel>
            <Select
              labelId="select-month-label"
              id="select-month"
              value={month}
              label="Month"
              onChange={handleMonthChange}
            >
              <MenuItem value={1}>Jan</MenuItem>
              <MenuItem value={2}>Feb</MenuItem>
              <MenuItem value={3}>Mar</MenuItem>
              <MenuItem value={4}>Apr</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>Jun</MenuItem>
              <MenuItem value={7}>Jul</MenuItem>
              <MenuItem value={8}>Aug</MenuItem>
              <MenuItem value={9}>Sep</MenuItem>
              <MenuItem value={10}>Oct</MenuItem>
              <MenuItem value={11}>Nov</MenuItem>
              <MenuItem value={12}>Dec</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth
            variant="outlined">
            <InputLabel htmlFor="outlined-adornment-year">Year</InputLabel>
            <OutlinedInput
              id="outlined-year"
              label="Year"
              type="number"
              value={values.expyr}
              onChange={handleChange('expyr')}
              startAdornment={
                <InputAdornment position="start">
                  <Typography variant="body1">20</Typography>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>

      <FormControl fullWidth sx={{ mb: 1.5 }}
        variant="outlined">
        <InputLabel htmlFor="outlined-adornment-ccv">CCV/CVC</InputLabel>
        <OutlinedInput
          id="outlined-ccv"
          label="CCV/CVC"
          type="number"
          value={values.ccv}
          onChange={handleChange('ccv')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="copy input"
                onClick={() => navigator.clipboard.writeText(values.ccv)}
                edge="end"
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Box sx={{ mb: 1.5 }}>
        <TextField
          label="Note"
          id="outlined-end-adornment"
          position="end"
          placeholder="Note"
          multiline
          rows={3}
          style={{ minWidth: '25%', width: '100%' }}

        />
      </Box>

    </>
  );
};

export function AddNote() {
  const [values, setValues] = React.useState({
    notename: '',
    note: '',
  });

  const handleChange = (props) => (event) => {
    event.preventDefault();
    setValues({ ...values, [props]: event.target.value });
  };

  return (
    <>
      <Box
        component="form"
        noValidate
        autoComplete="on"
        sx={{ mb: 1.5 }}
      >
        <TextField
          fullWidth
          id="outlined-name"
          label="Name"
          value={values.notename}
          onChange={handleChange('notename')}
        />
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <TextField
          label="Note"
          id="outlined-end-adornment"
          position="end"
          placeholder="Note"
          multiline
          rows={3}
          style={{ minWidth: '25%', width: '100%' }}

        />
      </Box>

    </>
  );
}






