import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";

function SensibilidadeDeConteudoPageContainer() {
  const { control, handleSubmit } = useForm();
  
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.get("sensibilidadeDeConteudoPage");

        console.log("Resposta do GET:", response);
        
        if (response.status === 200) {
          setOptions(response.data); 
        }
      } catch (error) {
        console.error("Erro na requisição GET:", error);

        if (!error.response) {
          showErrorToast("Erro de rede. Tente novamente.");
          return;
        }

        const { status } = error.response;

        if (status === 404) {
          showErrorToast("Dados não encontrados.");
        } else {
          showErrorToast("Erro ao carregar dados.");
        }
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await authService.post("sensibilidadeDeConteudoPage", data);
      showSucessToast("Sensibilidade de conteúdo salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar sensibilidade de conteúdo", error);
      showErrorToast("Erro ao salvar sensibilidade de conteúdo");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-label">Padrão de postagens</InputLabel>
            <Controller
              name="postagemPadrao"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="postagemPadrao"
                  id="postagemPadrao"
                  label="Padrão de postagens"
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

export default SensibilidadeDeConteudoPageContainer;
