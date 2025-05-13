import React, { useState, useEffect } from 'react';
import { authService } from '../../../services/AuthService';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);

  // Função para buscar postagens
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
    // Lógica de edição, pode redirecionar para uma página de edição
    console.log("Editando a postagem com ID:", postID);
    // Exemplo de redirecionamento:
    // window.location.href = `/edit-post/${postID}`;
  };

  const handleDelete = (postID) => {
    // Confirmar antes de excluir
    if (window.confirm("Tem certeza que deseja excluir esta postagem?")) {
      const email = getEmailFromCookies();  // Obter email do cookie

      // Usando authService.delete para excluir a postagem
      authService.delete(`delete-post?post_id=${postID}&email=${email}`, {
        withCredentials: true  // Envia cookies junto com a requisição
      })
        .then((response) => {
          console.log("Postagem deletada:", response);
          setPosts(posts.filter((post) => post.ID !== postID)); // Atualiza a lista após deletar
          showSucessToast("Postagem deletada com sucesso!");  // Exibe a mensagem de sucesso
        })
        .catch((error) => {
          console.error("Erro ao deletar postagem:", error);
          showErrorToast("Erro ao deletar postagem.");  // Exibe a mensagem de erro
        });
    }
  };

  // Função para pegar o email do cookie
  const getEmailFromCookies = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, "$1");
  };

  // Funções para mostrar os toasts de sucesso ou erro
  const showSucessToast = (message) => {
    alert(message); // Exemplo de alerta, você pode usar uma biblioteca de toasts real
  };

  const showErrorToast = (message) => {
    alert(message); // Exemplo de alerta, você pode usar uma biblioteca de toasts real
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={styles.title}>Lista de Postagens</h2>
      {posts.length === 0 ? (
        <p>Carregando postagens...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Imagem</th>
              <th style={styles.tableHeader}>Título</th>
              <th style={styles.tableHeader}>Conteúdo</th>
              <th style={styles.tableHeader}>Status</th>
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
                  <span style={{ ...styles.status, backgroundColor: getStatusColor(post) }}>
                    {post.Pinned ? 'Fixado' : 'Normal'}
                  </span>
                </td>
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
    </div>
  );

  function getStatusColor(post) {
    if (post.Pinned) return '#ffcb00'; // Amarelo
    return '#ccc'; // Cor padrão
  }
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
};

export default UserPosts;
