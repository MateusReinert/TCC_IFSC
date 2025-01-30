import * as React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = ({id, label, register}) => {
    return (
        <TextField
          required
          id={id}
          label={label}
          {...register(id)}
        />
    );
};

export default TextInput;