import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const OutlinedButton = ({ text }) => {
  return (
    <Button variant="outlined" type="submit" >{text}</Button>
  );
};

export default OutlinedButton;
