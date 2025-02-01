import React from 'react';
import { Box } from '@mui/system';
import TextInput from '../../../../shared/components/inputs/TextInput';
import PasswordInput from '../../../../shared/components/inputs/PasswordInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { useForm } from "react-hook-form";
import { authService } from '../../../../services/AuthService';
import { showSucessToast } from '../../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../../shared/components/toasters/ErrorToaster'; 


const AuthForm = ({ isSignUp, setIsSignUp }) => {

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      if (isSignUp) {
        await authService.postRegister(data);
        showSucessToast("Cadastro realizado com sucesso!");
        
      } else {
        await authService.postLogin(data);
        showSucessToast("Login realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      showErrorToast("Erro ao autenticar.");
      setIsSignUp(true);
      setIsSignUp(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box>
              <TextInput
                  id={'email'}
                  label={'E-mail'}
                  register={register}
                  />
            </Box>

            <Box>
              <PasswordInput 
                id={'Senha'}
                label={'Senha'}
                register={register}
              />
            </Box>

            {isSignUp && (
                <>
                  <Box>
                    <Box>
                      <PasswordInput 
                        id={'SenhaConfirmar'}
                        label={'Confirmar senha'}
                        register={register}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <TextInput
                        id={'Nome'}
                        label={'Nome'}
                        register={register}
                    />
                  </Box>
                </>
            )}

        <SubmitButton text={isSignUp ? 'Cadastrar' : 'Entrar'} />
        </Box>

    </form>
  );
};

export default AuthForm;
