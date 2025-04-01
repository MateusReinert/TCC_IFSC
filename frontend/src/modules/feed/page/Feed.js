import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Avatar, TextField, Button } from '@mui/material';
import { authService } from '../../../services/AuthService';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});

  // Função para pegar o e-mail dos cookies
  const getEmailFromCookies = () => {
    const email = document.cookie.replace(/(?:(?:^|.*;\s*)email\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return email;
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.get("posts");
      if (response.data) {
        setPosts(response.data);
        response.data.forEach((post) => {
          fetchComments(post.ID);
        });
      } else {
        setError("Nenhuma postagem encontrada.");
      }
    } catch (error) {
      setError("Erro ao buscar postagens.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await authService.get(`list-comments/${postId}`);
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: response.data,
      }));
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const newComment = newComments[postId];
    if (!newComment) return;

    const email = getEmailFromCookies();
    if (!email) {
      console.error("E-mail não encontrado nos cookies");
      return;
    }

    try {
      const response = await authService.post('create-comment', { postId, content: newComment, userEmail: email });
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId); // Recarrega os comentários
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Box sx={{ maxWidth: '800px', width: '100%' }}>
        {loading ? (
          <div>Carregando postagens...</div>
        ) : error ? (
          <div>{error}</div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.ID} sx={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: 3, marginBottom: '20px' }}>
              <CardContent sx={{ padding: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <Avatar sx={{ marginRight: '12px', width: 40, height: 40, border: '2px solid #3f51b5' }} />
                  <Typography variant="body2" color="textSecondary">{post.UserEmail || 'E-mail não disponível'}</Typography>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  {post.Title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginBottom: '16px' }}>
                  {post.Content}
                </Typography>

                <Box sx={{ position: 'relative', width: '100%', height: '300px' }}>
                  {post.Image && (
                    <img
                      src={`data:image/png;base64,${post.Image}`}
                      alt="Imagem do post"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                </Box>

                <Box sx={{ marginTop: '16px' }}>
                  <Typography variant="h6">Comentários</Typography>

                  {comments[post.ID] && comments[post.ID].length > 0 ? (
                    comments[post.ID].map((comment) => (
                      <Box key={comment.id} sx={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', backgroundColor: '#f1f1f1' }}>
                        {/* Nome do usuário e E-mail */}
                        <Box sx={{ marginBottom: '8px' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {comment.userName || 'Anônimo'} {/* Exibindo 'Anônimo' se não houver nome */}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {comment.userEmail}
                          </Typography>
                        </Box>

                        {/* Conteúdo do comentário */}
                        <Typography variant="body2" color="textSecondary">
                          {comment.content}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <div>Não há comentários ainda.</div>
                  )}

                  <TextField
                    label="Novo comentário"
                    variant="outlined"
                    fullWidth
                    value={newComments[post.ID] || ""}
                    onChange={(e) => setNewComments((prev) => ({ ...prev, [post.ID]: e.target.value }))}
                    sx={{ marginTop: '8px' }}
                  />
                  <Button
                    sx={{ marginTop: '8px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleCommentSubmit(post.ID)}
                  >
                    Comentar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <div>Não há postagens disponíveis.</div>
        )}
      </Box>
    </Box>
  );
};

export default Feed;
