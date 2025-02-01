import React from "react";
import { useForm } from "react-hook-form";
import TextInput from '../../../../shared/components/inputs/TextInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box } from '@mui/system';
import { authService } from '../../../../services/AuthService';
import { showErrorToast } from "../../../../shared/components/toasters/ErrorToaster";
import { showSucessToast } from "../../../../shared/components/toasters/SucessToaster";


function SenhaPageContainer() {
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            await authService.postSenhaPage(data);
            showSucessToast("Senha salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar senha", error);
            showSucessToast("Erro ao salvar senha");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
                    <TextInput
                        id={'senhaAtual'}
                        label={'Senha atual'}
                        register={register}
                    />
                </Box>

                <Box>
                    <TextInput
                        id={'novaSenha'}
                        label={'Nova senha'}
                        register={register}
                    />
                </Box>

                <Box>
                    <TextInput
                        id={'confirmarNovaSenha'}
                        label={'Confirmar nova senha'}
                        register={register}
                    />
                </Box>
                <Box>
                    <SubmitButton text={'Salvar'} />
                </Box>
            </Box>


        </form>
    );
}

export default SenhaPageContainer;
