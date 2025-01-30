import React from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function VisibilidadeDoPerfilPageContainer() {
    const { control, handleSubmit } = useForm();

    const options = [
        { value: 'publico', label: 'publico' },
        { value: 'privado', label: 'privado' },
    ];

    const onSubmit = (data) => {
        console.log("Dados", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="select-label">Visibilidade do perfil</InputLabel>
                        <Controller
                            name="dias"
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

export default VisibilidadeDoPerfilPageContainer;
