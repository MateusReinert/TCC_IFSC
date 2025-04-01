  import React, { useState } from 'react';
  import { Box, TextField, Button, Typography, InputLabel, FormControl } from '@mui/material';
  import { useForm } from 'react-hook-form';
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

        console.log('Resposta da API:', response);  // Log da resposta da API

        // Verifica se a resposta foi bem-sucedida
        if (response.status === 201) {
          showSucessToast("Postagem criada com sucesso!");
          return;
        } else {
          // Caso a resposta não seja de sucesso
          showErrorToast("Erro ao criar postagem.");
        }

        
      } catch (error) {
        console.error("Erro ao criar postagem:", error);

        // Verifica se a resposta de erro está presente
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '600px',
            margin: 'auto',
            padding: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          {/* Título */}
          <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 3 }}>
            Criar Postagem
          </Typography>

          {/* Campo de Título */}
          <TextField
            {...register('title')}
            label="Título da Postagem"
            variant="outlined"
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />

          {/* Campo de Conteúdo */}
          <TextField
            {...register('content')}
            label="Conteúdo da Postagem"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />

          {/* Seletor de Imagem */}
          <FormControl sx={{ marginBottom: 2 }}>
            <InputLabel htmlFor="image"></InputLabel>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              style={{ marginTop: '8px', padding: '8px 0' }}
            />
          </FormControl>

          {/* Botão de Submissão */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: 2,
              padding: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Criar Postagem
          </Button>
        </Box>
      </form>
    );
  };

  export default PostagemForm;
