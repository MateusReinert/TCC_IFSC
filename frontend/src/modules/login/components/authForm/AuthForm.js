import React from 'react';
import { Box } from '@mui/system';
import TextInput from '../../../../shared/components/inputs/TextInput';
import PasswordInput from '../../../../shared/components/inputs/PasswordInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { useForm } from "react-hook-form";
import { authService } from '../../../../services/AuthService';
import { showSucessToast } from '../../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../../shared/components/toasters/ErrorToaster'; 
import Cookies from "js-cookie";


const AuthForm = ({ isSignUp, setIsSignUp }) => {


  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      let response;
  
      console.log(data.email);
  
      if (isSignUp) {
        response = await authService.post("register", data);
  
        if (response.status === 201) {
          showSucessToast("Cadastro realizado com sucesso!");
          setIsSignUp(false);
          return;
        }
      } else {
        response = await authService.post("login", data);
  
        if (response.status === 200) {
          console.log(data.email);
          showSucessToast("Login realizado com sucesso!");
          Cookies.set("email", data.email, { expires: 7 });
          window.location.href = "http://localhost:3000";
          return;
        }
      }
  
      showErrorToast("Erro ao autenticar.");
    } catch (error) {
      console.error("Erro na autenticação:", error);
  
      if (!error.response) {
        showErrorToast("Erro de rede. Tente novamente.");
        return;
      }
  
      const { status, data } = error.response;
  
      if (status === 409) {
        showErrorToast("Este e-mail já está cadastrado.");
      } else if (status === 401) {
        showErrorToast("Usuário ou senha incorretos.");
      } else if (status === 403) {
        showErrorToast("Usuário inativo ou não aprovado.");
      } else {
        showErrorToast("Erro ao autenticar.");
      }
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
                id={'password'}
                label={'Senha'}
                register={register}
              />
            </Box>

            {isSignUp && (
                <>
                  <Box>
                    <Box>
                      <PasswordInput 
                        id={'passwordConfirmation'}
                        label={'Confirmar senha'}
                        register={register}
                      />
                    </Box>
                  </Box>

                  <Box>
                    <TextInput
                        id={'name'}
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
