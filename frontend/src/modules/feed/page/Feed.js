import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Avatar } from '@mui/material';
import { postService } from '../../../services/PostService';

const Feed = () => {
  const [posts, setPosts] = useState([]);  // Armazenar postagens
  const [loading, setLoading] = useState(true);  // Controle de carregamento
  const [error, setError] = useState(null);  // Armazenar mensagem de erro

  const fetchPosts = async () => {
    setLoading(true);  // Inicia o carregamento
    setError(null);  // Limpa o erro antes de tentar buscar os dados
  
    try {
      console.log("Iniciando requisição para obter postagens...");
      const response = await postService.getPosts(); // Faz a requisição para pegar as postagens
  
      console.log("Resposta completa:", response); // Exibe a resposta da API
  
      // Verifique se a resposta é um objeto e contém a propriedade 'data' corretamente
      if (response && Array.isArray(response) && response.length > 0) {
        console.log("Postagens recebidas:", response);  // Verifique se está recebendo os dados corretamente
        setPosts(response);  // Atualiza o estado com as postagens
      } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log("Postagens recebidas de response.data:", response.data);  // Verifica o conteúdo de data
        setPosts(response.data);  // Atualiza o estado com as postagens
      } else {
        console.log("Nenhuma postagem encontrada.");
        setError("Nenhuma postagem encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
      setError("Erro ao buscar postagens. Tente novamente mais tarde.");
    } finally {
      setLoading(false);  // Indica que o carregamento terminou
    }
  };

  useEffect(() => {
    console.log("Componente montado, chamando fetchPosts...");
    fetchPosts(); // Chama a função para buscar as postagens ao montar o componente
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Centraliza as postagens
        padding: '20px', // Espaço ao redor
      }}
    >
      <Box sx={{ maxWidth: '800px', width: '100%' }}> {/* Limita a largura das postagens */}
        {loading ? (
          <div>Carregando postagens...</div>
        ) : error ? (
          <div>{error}</div>  // Exibe a mensagem de erro
        ) : posts.length > 0 ? (
          posts.map((post) => {
            console.log("Post sendo renderizado:", post); // Log de cada post sendo renderizado
            return (
              <Card key={post.ID} sx={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: 3, marginBottom: '20px' }}>
                <CardContent sx={{ padding: '16px' }}>
                  {/* Exibe foto de perfil (avatar) e e-mail ao lado */}
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    {/* Avatar do usuário */}
                    <Avatar sx={{ marginRight: '12px' }} />
                    {/* E-mail do usuário */}
                    <Typography variant="body2" color="textSecondary">
                      {post.UserEmail || 'E-mail não disponível'}
                    </Typography>
                  </Box>

                  {/* Título do post */}
                  <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {post.Title}
                  </Typography>

                  {/* Descrição do post */}
                  <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '16px' }}>
                    {post.Content}
                  </Typography>

                  <Box sx={{ position: 'relative', width: '100%', height: '300px' }}>
                    {/* Imagem grande do post */}
                    {post.Image && (
                      <img
                        src={`data:image/png;base64,${post.Image}`}
                        alt="Imagem do post"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div>Não há postagens disponíveis.</div>
        )}
      </Box>
    </Box>
  );
};

export default Feed;
