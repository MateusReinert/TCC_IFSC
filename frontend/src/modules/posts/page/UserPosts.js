import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/AuthService';
import PostForm from '../../home/components/PostForm';
import { showSucessToast } from '../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../shared/components/toasters/ErrorToaster';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar
} from '@mui/material';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [postFormDialogOpen, setPostFormDialogOpen] = useState(false); // Estado para controlar o diálogo de criação de postagens

  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        console.log("Postagens carregadas:", data);
      })
      .catch((error) => {
        console.error("Erro ao carregar postagens:", error);
      });
  }, []);

  const handleEdit = (postID) => {
    const postToEdit = posts.find((p) => p.ID === postID);
    if (!postToEdit) {
      console.log("Postagem não encontrada!");
      return;
    }

    setSelectedPost(postToEdit);
    setEditTitle(postToEdit.Title);
    setEditContent(postToEdit.Content);
    setEditDialogOpen(true);
  };

  const handleDelete = (postID) => {
    if (window.confirm("Tem certeza que deseja excluir esta postagem?")) {
      const email = getEmailFromCookies();

      authService.delete(`delete-post?post_id=${postID}&email=${email}`, {
        withCredentials: true
      })
        .then((response) => {
          console.log("Postagem deletada:", response);
          setPosts(posts.filter((post) => post.ID !== postID));
          showSucessToast("Postagem deletada com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao deletar postagem:", error);
          showErrorToast("Erro ao deletar postagem.");
        });
    }
  };

  const handleSaveEditPost = async () => {
    if (!selectedPost || !selectedPost.ID) {
      console.log("ID da postagem inválido ou não encontrado!", selectedPost);
      return;
    }

    console.log('Salvando edição...');

    const formData = new FormData();
    formData.append("post_id", selectedPost.ID.toString());
    formData.append("title", editTitle);
    formData.append("content", editContent);
    formData.append("email", selectedPost.UserEmail);

    try {
      await authService.put("edit-post", formData);

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.ID === selectedPost.ID
            ? { ...p, Title: editTitle, Content: editContent }
            : p
        )
      );

      setEditDialogOpen(false);
      setSnackbarMessage("Postagem atualizada!");
      setSnackbarOpen(true);
      showSucessToast("Postagem atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar a postagem:", error);
      showErrorToast("Erro ao editar a postagem.");
    }
  };

  const getEmailFromCookies = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, "$1");
  };

  const handlePostCreated = () => {
    // Após a criação de um novo post, recarregar a lista de postagens
    fetch("http://localhost:8000/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={styles.title}>Lista de Postagens</h2>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setPostFormDialogOpen(true)} // Abre o Dialog de criação de post
        style={styles.addButton}
      >
        Adicionar Postagem
      </Button>
      {posts.length === 0 ? (
        <p>Carregando postagens...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Imagem</th>
              <th style={styles.tableHeader}>Título</th>
              <th style={styles.tableHeader}>Conteúdo</th>
              <th style={styles.tableHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.ID} style={styles.postRow}>
                <td>
                  <img
                    src={`data:image/png;base64,${post.Image}`}
                    alt="Imagem do post"
                    style={styles.avatar}
                  />
                </td>
                <td>{post.Title}</td>
                <td>{post.Content}</td>
                <td>
                  <div style={styles.actions}>
                    <button onClick={() => handleEdit(post.ID)} style={styles.editButton}>Editar</button>
                    <button onClick={() => handleDelete(post.ID)} style={styles.deleteButton}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={postFormDialogOpen} onClose={() => setPostFormDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Postagem</DialogTitle>
        <DialogContent>
          <PostForm onPostCreated={handlePostCreated} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostFormDialogOpen(false)} color="secondary">Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Postagem</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            variant="outlined"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Conteúdo"
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancelar</Button>
          <Button onClick={handleSaveEditPost}>Salvar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};


const styles = {
  title: {
    textAlign: 'left',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '8px',
    backgroundColor: '#f4f4f4',
  },
  postRow: {
    borderBottom: '1px solid #ddd',
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  status: {
    padding: '5px 10px',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '12px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  addButton: {
    marginBottom: '20px',
  }
};

export default UserPosts;
