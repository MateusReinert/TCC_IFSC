import * as React from 'react';
import Button from '@mui/material/Button';

// ConfirmButton agora aceita children
const ConfirmButton = ({ onClick }) => {
    return (
        <Button variant="contained" onClick={onClick}>Entrar</Button>
    );
};

export default ConfirmButton;
