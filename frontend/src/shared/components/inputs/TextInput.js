import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({ id, label, register, sx, ...props }) => {
  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      fullWidth
      {...register(id)}
      sx={sx}
      {...props}
    />
  );
};

export default TextInput;
