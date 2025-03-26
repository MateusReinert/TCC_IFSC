import React, { useState } from 'react';
import { Box } from '@mui/system';
import TextInput from '../../../shared/components/inputs/TextInput';
import SubmitButton from '../../../shared/components/buttons/SubmitButton';
import { useForm } from "react-hook-form";
import { postService } from '../../../services/PostService';
import { showSucessToast } from '../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../shared/components/toasters/ErrorToaster';
import Cookies from 'js-cookie';  // Para pegar o e-mail dos cookies

const PostagemForm = () => {
  const { register, handleSubmit } = useForm();
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      setImage(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Obtém o e-mail do usuário a partir do cookie
      const email = Cookies.get('email'); 

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('image', image);
      formData.append('email', email);  // Adiciona o e-mail ao FormData

      const response = await postService.createPost(formData);

      if (response.status === 201) {
        showSucessToast("Postagem criada com sucesso!");
        return;
      }

      showErrorToast("Erro ao criar postagem.");
    } catch (error) {
      console.error("Erro ao criar postagem:", error);

      if (!error.response) {
        showErrorToast("Erro de rede. Tente novamente.");
        return;
      }

      const { status } = error.response;

      if (status === 400) {
        showErrorToast("Erro nos dados fornecidos.");
      } else {
        showErrorToast("Erro ao criar postagem.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box>
          <TextInput
            id={'title'}
            label={'Título da Postagem'}
            register={register}
          />
        </Box>

        <Box>
          <TextInput
            id={'content'}
            label={'Conteúdo da Postagem'}
            register={register}
          />
        </Box>

        <Box>
          <label htmlFor="image">Escolha uma imagem:</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
          />
        </Box>

        <SubmitButton text={'Criar Postagem'} />
      </Box>
    </form>
  );
};

export default PostagemForm;
