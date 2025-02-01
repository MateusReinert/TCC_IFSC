import * as React from 'react';
import Button from '@mui/material/Button';

const OutlinedButton = ({ text, onClick }) => {
  return (
    <Button variant="outlined" type="submit" onClick={onClick}>
      {text}
    </Button>
  );
};

export default OutlinedButton;
