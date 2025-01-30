import React from "react";
import { useForm } from "react-hook-form";
import TextInput from '../../../../shared/components/inputs/TextInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box } from '@mui/system';


function SenhaPageContainer() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Dados", data);
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
