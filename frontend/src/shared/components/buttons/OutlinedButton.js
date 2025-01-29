import * as React from 'react';
import Button from '@mui/material/Button';

// OutlinedButton agora também aceita children
const OutlinedButton = ({ onClick }) => {
    return (
        <Button variant="outlined" onClick={onClick}>Cadastrar</Button>
    );
};

export default OutlinedButton;
