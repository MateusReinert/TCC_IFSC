import React from 'react';
import { Box } from '@mui/system';
import TextInput from '../../../../shared/components/inputs/TextInput';
import PasswordInput from '../../../../shared/components/inputs/PasswordInput';
import { useNavigate } from 'react-router-dom';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';

const AuthForm = ({ isSignUp }) => {
  const navigate = useNavigate(); 

  const handleNavigate = () => {
    if(isSignUp) {
        navigate('/login'); 
    } else {
        navigate('/'); 
    }
  };

  return (
    <form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box>
              <TextInput 
                  label={'E-mail'}
                  />
            </Box>

            <Box>
              <PasswordInput />
            </Box>

            {isSignUp && (
                <>
                  <Box>
                    <Box>
                      <PasswordInput />
                    </Box>
                  </Box>

                  <Box>
                    <TextInput 
                        label={'Nome'}
                    />
                  </Box>
                </>
            )}

        <SubmitButton onClick={handleNavigate} text={isSignUp ? 'Cadastrar' : 'Entrar'} />
        </Box>

    </form>
  );
};

export default AuthForm;
