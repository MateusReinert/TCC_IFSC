// src/components/SignIn.js
import React from 'react';
import AuthForm from '../authForm/AuthForm';
import Box from '@mui/material/Box';

const SignIn = () => {
  return (
    <Box className="auth-box">
      <AuthForm isSignUp={false} />
    </Box>
  );
};

export default SignIn;
