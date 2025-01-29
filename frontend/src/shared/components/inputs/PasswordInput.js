import * as React from 'react';
import TextField from '@mui/material/TextField';

const PasswordInput = () => {
    return (
        <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
        />
    );
};

export default PasswordInput;