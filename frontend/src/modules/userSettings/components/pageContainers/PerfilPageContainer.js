import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from '../../../../shared/components/inputs/TextInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";
import Cookies from "js-cookie"; // Importando js-cookie

function PerfilPageContainer() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const email = Cookies.get("email"); 

    if (!email) {
      showErrorToast("Email não encontrado nos cookies.");
      return;
    }

    const postData = {
      bio: data.biografia,
      email: email,
    };

    try {
      await authService.post("perfilPage", postData);
      showSucessToast("Informações do usuário salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar informações do usuário:", error);
      showErrorToast("Erro ao salvar informações do usuário");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
          <TextInput
            id="biografia"
            label="Biografia"
            register={register}
            sx={{
              height: '125px',
              textarea: { minHeight: '100px' },
            }}
            multiline
          />
        </Box>

        <Box>
          <SubmitButton text={'Salvar'} />
        </Box>
      </Box>
    </form>
  );
}

export default PerfilPageContainer;
