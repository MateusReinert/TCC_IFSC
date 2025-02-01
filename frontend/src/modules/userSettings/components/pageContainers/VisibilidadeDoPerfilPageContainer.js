import React from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";

function VisibilidadeDoPerfilPageContainer() {
    const { control, handleSubmit } = useForm();

    const options = [
        { value: 'publico', label: 'publico' },
        { value: 'privado', label: 'privado' },
    ];

    const onSubmit = async (data) => {
        try {
            await authService.postVisibilidadeDoPerfilPage(data);
            showSucessToast("Visibilidade do perfil salvo com sucesso!");
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
