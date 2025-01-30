import React from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function FontePageContainer() {
  const { control, handleSubmit } = useForm();

  const options = [
    { value: 'publico', label: 'Público' },
    { value: 'amigos', label: 'Apenas amigos' },
    { value: 'privado', label: 'Privado' },
  ];


  const onSubmit = (data) => {
    console.log("Dados", data);
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

export default FontePageContainer;
