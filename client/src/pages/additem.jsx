import React, { useRef } from 'react';

import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EnhancedEncryptionRoundedIcon from '@mui/icons-material/EnhancedEncryptionRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import SafeLogin from '../components/forms/safelogin';
import SafeCard from '../components/forms/safecard';
import SafeNote from '../components/forms/safenote';

export default function AddItem() {

  const child = useRef();

  const [type, setType] = React.useState(1);
  const [typeName, setTypeName] = React.useState('Login');

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleClose = event => {
    setTypeName(event.target.innerText);
  }

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
          <SafeLogin ref={child} />)
        || (type === 2 &&
          <SafeCard ref={child} />)
        || (type === 3 &&
          <SafeNote ref={child} />)
        ||
        <SafeLogin ref={child} />
      }
      <Button
        variant="outlined"
        onClick={() => child.current.addItem()}
        startIcon=
        {
            (type === 1 &&
              <EnhancedEncryptionRoundedIcon />)
        || (type === 2 &&
          <AddCardRoundedIcon />)
        || (type === 3 &&
          <NoteAddRoundedIcon />)
        ||
        <EnhancedEncryptionRoundedIcon />
        }
        >
        Add {typeName}
      </Button>
    </div >
  );
};
