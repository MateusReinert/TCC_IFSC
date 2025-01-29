import React from 'react';
import Banner from '../../../shared/components/banners/Banner';
import Grid from '@mui/material/Grid';
import SignUp from '../components/signUp/SignUp';
import SignIn from '../components/signIn/SignIn';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ConfirmButton from '../../../shared/components/buttons/ConfirmButton';
import OutlinedButton from '../../../shared/components/buttons/OutlinedButton';


const LoginPage = () => {

    const [isSignUp, setIsSignUp] = useState(false);


    return (
        <Grid 
            container 
            sx={{ 
                height: '100vh', 
                width: '100%',
                overflow: 'hidden'
            }}
        >
            <Grid item xs={3} sx={{ 
                    backgroundColor: 'white', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '20px',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <ConfirmButton onClick={() => setIsSignUp(false)}></ConfirmButton>
                    <OutlinedButton onClick={() => setIsSignUp(true)}></OutlinedButton>
                </Box>
                <Box>
                    {isSignUp ? <SignUp /> : <SignIn />}
                </Box>
            </Grid>
            <Grid 
                item 
                xs={9} 
                sx={{
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
                <Banner />
            </Grid>
        </Grid>
    );
};

export default LoginPage;
