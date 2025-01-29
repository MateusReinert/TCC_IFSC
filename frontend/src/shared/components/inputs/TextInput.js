import * as React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = ({label}) => {
    return (
        <TextField
          required
          id="outlined-required"
          label={label}
        />
    );
};

export default TextInput;