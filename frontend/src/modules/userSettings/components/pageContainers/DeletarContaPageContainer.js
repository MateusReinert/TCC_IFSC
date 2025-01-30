import React from "react";
import { useForm } from "react-hook-form";
import SubmitButton from '../../../../shared/components/buttons/SubmitButton';
import { Box } from '@mui/system';


function DeletarContaPageContainer() {

    const { handleSubmit } = useForm();
    
        const onSubmit = (data) => {
            console.log("Dados", data);
        }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
                    <SubmitButton text={'Deletar conta'} />
                </Box>
            </Box>


        </form>
    );
}

export default DeletarContaPageContainer;
