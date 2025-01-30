import { Box } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import TextInput from '../../../../shared/components/inputs/TextInput';
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';

function PerfilPageContainer() {

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log("Dados", data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
                    <TextInput
                        id={'email'}
                        label={'E-mail'}
                        register={register}
                    />
                </Box>

                <Box>
                    <TextInput
                        id={'Biografia'}
                        label={'Biografia'}
                        register={register}
                    />
                </Box>

                <Box>
                    <TextInput
                        id={'Links Externos'}
                        label={'Links Externos'}
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

export default PerfilPageContainer;
