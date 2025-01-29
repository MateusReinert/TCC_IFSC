import * as React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const OutlinedButton = ({ onClick, route, text }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (route) {
      navigate(route);
    }
  };

  return (
    <Button variant="outlined" onClick={handleClick}>{text}</Button>
  );
};

export default OutlinedButton;
