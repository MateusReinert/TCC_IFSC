import * as React from 'react';
import TextField from '@mui/material/TextField';

const PasswordInput = ({id, label, register}) => {
    return (
        <TextField
          id={id}
          label={label}
          type="password"
          autoComplete="current-password"
          {...register(id)}
        />
    );
};

export default PasswordInput;