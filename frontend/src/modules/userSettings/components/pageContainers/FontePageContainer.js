import React from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function FontePageContainer() {
  const { control, handleSubmit } = useForm();

  const options = [
    { value: 'Arial', label: 'Arial(Padrão)' },
    { value: 'Roboto', label: 'Roboto' },
  ];

  const size = [
    { value: 'pequeno', label: 'pequeno' },
    { value: 'medio', label: 'medio(Padrão)' },
    { value: 'grande', label: 'grande' },
  ];

  const onSubmit = (data) => {
    console.log("Dados", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-label">Fonte</InputLabel>
            <Controller
              name="fonte"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="Fonte"
                  id="Fonte"
                  label="Fonte"
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

          <FormControl fullWidth>
            <InputLabel id="select-label">Tamanho da fonte</InputLabel>
            <Controller
              name="tamanhoFonte"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="tamanhoFonte"
                  id="tamanhoFonte"
                  label="Tamanho da fonte"
                >
                  {size.map((size) => (
                    <MenuItem key={size.value} value={size.value}>
                      {size.label}
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
