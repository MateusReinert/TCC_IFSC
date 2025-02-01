import React from "react";
import { useForm, Controller } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import ControlledSwitch from '../../../../shared/components/switchs/ControlledSwitch';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from '../../../../shared/components/toasters/ErrorToaster';
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";

function AlteracaoDeSenhaPageContainer() {
    const { control, handleSubmit } = useForm();

    const options = [
        { value: 0, label: ' ' },
        { value: 10, label: 'A cada dez dias' },
        { value: 20, label: 'A cada vinte dias' },
        { value: 30, label: 'A cada trinta dias' }
    ];

    const onSubmit = async (data) => {
        try {
            await authService.postAlteracaoDeSenhaPage(data);
            showSucessToast("Alteração de senha salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alteração de senha", error);
            showErrorToast("Erro ao salvar alteração de senha");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
                    <ControlledSwitch
                        control={control}
                        name="switchField"
                        label="Ativar alteração de senha?" 
                    />
                </Box>

                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="select-label">Selecione a frequencia</InputLabel>
                        <Controller
                            name="dias"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    labelId="select-label"
                                    id="diasAlteracaoSenha"
                                    label="Selecione a frequencia"
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

export default AlteracaoDeSenhaPageContainer;
