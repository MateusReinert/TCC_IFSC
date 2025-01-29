import React from 'react';
import AuthForm from '../authForm/AuthForm';
import Box from '@mui/material/Box';

const SignUp = () => {
  return (
    <Box className="auth-box">
      <AuthForm isSignUp={true} />
    </Box>
  );
};

export default SignUp;
