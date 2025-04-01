import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Skeleton } from '@mui/material';
import { authService } from '../../../services/AuthService'; // Serviço authService
import { showSucessToast } from '../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../shared/components/toasters/ErrorToaster';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar a lista de usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const response = await authService.get('users');
        console.log("Users fetched:", response.data);
        setUsers(response.data);
      } catch (err) {
        console.log("Error fetching users:", err);
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Função para atualizar o tipo de usuário
  const handleUpdateUserType = async (userId, userType) => {
    try {
      console.log("Sending request to update user type:", { user_id: userId, user_type: userType });
      const response = await authService.put('updateUserType', {
        user_id: userId,
        user_type: userType,
      });
      console.log("Response from update:", response);

      if (response.status === 200) {
        showSucessToast('Tipo de usuário atualizado com sucesso!');
        
        // Atualiza o estado dos usuários após a alteração
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, user_type: userType } : user
          )
        );
      }
    } catch (err) {
      console.log("Error updating user type:", err);
      showErrorToast('Erro ao atualizar o tipo de usuário');
    }
  };

  // Exibe a tela de loading enquanto carrega os dados
  if (loading) {
    return (
      <Box sx={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
        <h1>User List</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Skeleton width={60} /></TableCell>
                <TableCell><Skeleton width={100} /></TableCell>
                <TableCell><Skeleton width={150} /></TableCell>
                <TableCell><Skeleton width={130} /></TableCell>
                <TableCell><Skeleton width={100} /></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={150} /></TableCell>
                  <TableCell><Skeleton width={130} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // Exibe a mensagem de erro caso algo falhe
  if (error) {
    return <Box>{error}</Box>;
  }

  // Exibe a lista de usuários
  return (
    <Box sx={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
      <h1>User List</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Tipo de Usuário</strong></TableCell>
              <TableCell><strong>Criado em</strong></TableCell>
              <TableCell><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.user_type}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.user_type === 'pending' ? 'success' : user.user_type === 'regular' ? 'primary' : 'secondary'}
                    onClick={() => {
                      const newType = user.user_type === 'pending' ? 'regular' : user.user_type === 'regular' ? 'admin' : 'regular';
                      console.log("Changing user type to:", newType); // Logando a mudança de tipo
                      handleUpdateUserType(user.id, newType);
                    }}
                  >
                    {user.user_type === 'pending' ? 'Aprovar' : user.user_type === 'regular' ? 'Permitir Acesso Completo' : 'Limitar Acesso'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
