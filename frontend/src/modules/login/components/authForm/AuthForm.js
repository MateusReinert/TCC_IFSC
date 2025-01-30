import React from 'react';
import { Box } from '@mui/system';
import TextInput from '../../../../shared/components/inputs/TextInput';
import PasswordInput from '../../../../shared/components/inputs/PasswordInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { useForm } from "react-hook-form";

const AuthForm = ({ isSignUp }) => {

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Dados", data);
  }

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
