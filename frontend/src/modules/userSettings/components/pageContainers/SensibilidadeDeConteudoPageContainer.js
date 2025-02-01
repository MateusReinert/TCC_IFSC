import React from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";

function SensibilidadeDeConteudoPageContainer() {
  const { control, handleSubmit } = useForm();

  const options = [
    { value: 'livre', label: 'Livre' },
    { value: 'sensiveis', label: 'Sensiveis' },
    { value: 'restritas', label: 'Restritas' },
  ];


  const onSubmit = async (data) => {
    try {
      await authService.postSensibilidadeDeConteudoPage(data);
      showSucessToast("Sensibilidade de conteudo salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar sensibilidade de conteudo", error);
      showErrorToast("Erro ao salvar sensibilidade de conteudo");
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
                      {option.label}
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
