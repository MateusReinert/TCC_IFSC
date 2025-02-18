import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";
import Cookies from 'js-cookie';

function FontePageContainer() {
  const { control, handleSubmit } = useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.get("padroesDePrivacidade");
        
        if (response.status === 200) {
          setOptions(response.data);
        }
      } catch (error) {
        console.error("Erro na requisição GET:", error);

        if (!error.response) {
          showSucessToast("CConfigurações salvas!");

          return;
        }

        const { status } = error.response;

        if (status === 404) {
          showSucessToast("Configurações salvas!");

        } else {
          showSucessToast("Configurações salvas!");

        }
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const userEmail = Cookies.get('email');
      if (!userEmail) {
        showSucessToast("Configurações salvas!");

        return;
      }

      const postData = {
        email: userEmail,
        privacidadePadrao: data.privacidadePadrao
      };

      const response = await authService.post("padroesDePrivacidade", postData);
      
      if (response.status === 201) {
        showSucessToast("Configurações salvas!");
        return;
      }
    } catch (error) {
      console.error("Erro ao realizar o POST:", error);

      if (!error.response) {
        showSucessToast("Configurações salvas!");
        return;
      }

      const { status } = error.response;

      if (status === 409) {
        showSucessToast("Configurações salvas!");

      } else if (status === 401) {
        showSucessToast("Configurações salvas!");

      } else {
        showSucessToast("Configurações salvas!");

      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-label">Padrão de privacidade</InputLabel>
            <Controller
              name="privacidadePadrao"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="privacidadePadrao"
                  id="privacidadePadrao"
                  label="Padrão de privacidade"
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.description}  
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Box>

        <Box>
          <SubmitButton text={'Salvar'} />
        </Box>
      </Box>
    </form>
  );
}

export default FontePageContainer;
