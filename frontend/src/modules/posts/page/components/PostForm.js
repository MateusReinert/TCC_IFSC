import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, Typography, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { postService } from '../../../services/PostService';
import { showSucessToast } from '../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../shared/components/toasters/ErrorToaster';
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';

const PostagemForm = ({ onPostCreated, open, onClose }) => {
  const { register, handleSubmit, reset } = useForm();
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      const email = Cookies.get('email');

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('image', image);
      formData.append('email', email);

      const response = await postService.createPost(formData);

      if (response.status === 201) {
        showSucessToast("Postagem criada com sucesso!");
        reset();
        setImage(null);

        if (onPostCreated) {
          onPostCreated();
        }

        onClose();  // Fechar o Dialog após o sucesso
        return;
      } else {
        showErrorToast("Erro ao criar postagem.");
      }
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        boxShadow: 'none',
      }}
    >
      <DialogTitle>
        Criar Postagem
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="fechar"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxWidth: '600px',
              margin: 'auto',
              padding: 2,
              borderRadius: 2,
              backgroundColor: 'white',
              boxShadow: 'none',
            }}
          >
            <TextField
              {...register('title')}
              label="Título da Postagem"
              variant="outlined"
              fullWidth
              required
              sx={{ marginBottom: 2 }}
            />

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

            <FormControl sx={{ marginBottom: 2, position: 'relative' }}>
              <Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                sx={{
                  border: '2px dashed #ccc',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: 'none',
                }}
              >
                <Typography variant="body2">
                  Arraste uma imagem aqui ou clique para selecionar
                </Typography>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    cursor: 'pointer',
                    boxShadow: 'none',
                  }}
                />
              </Box>
              {image && (
                <Typography variant="caption" sx={{ marginTop: 1 }}>
                  Imagem selecionada: {image.name}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Criar Postagem
          </Button>
        </DialogActions>
      </form>
    </Dialog>

  );
};

export default PostagemForm;
