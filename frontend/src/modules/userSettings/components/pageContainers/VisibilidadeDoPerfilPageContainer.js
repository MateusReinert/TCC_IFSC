import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authService } from '../../../../services/AuthService';
import Cookies from 'js-cookie';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";

function VisibilidadeDoPerfilPageContainer() {
  const { control, handleSubmit, setValue } = useForm();
  const [options, setOptions] = useState([]);
  const userEmail = Cookies.get("email");

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await authService.get("visibilidadeDoPerfilPage");

              if (response.status === 200) {
                  setOptions(response.data);
                  setValue("visibilidade", response.data[0]);
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
  }, [setValue]);

  const onSubmit = async (data) => {
      try {
          if (!userEmail) {
              showErrorToast("Usuário não encontrado nos cookies");
              return;
          }

          const response = await authService.post("visibilidadeDoPerfilPage", {
              email: userEmail,
              visibilidade: data.visibilidade
          });

          if (response.status === 200) {
              showSucessToast("Visibilidade do perfil salva com sucesso!");
          } else {
              showErrorToast("Erro ao atualizar visibilidade.");
          }
      } catch (error) {
          console.error("Erro ao salvar visibilidade do perfil", error);
          showErrorToast("Erro ao salvar visibilidade do perfil");
      }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-label">Visibilidade do perfil</InputLabel>
            <Controller
              name="visibilidade"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="select-label"
                  id="visibilidade"
                  label="Visibilidade do perfil"
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.description} {/* Alterado de label para description */}
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

export default VisibilidadeDoPerfilPageContainer;
