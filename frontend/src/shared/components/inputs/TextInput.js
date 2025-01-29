import * as React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = () => {
    return (
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
        />
    );
};

export default TextInput;