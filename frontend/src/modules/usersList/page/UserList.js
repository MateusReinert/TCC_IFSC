import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, FormControl, InputLabel, Paper, Box } from '@mui/material';
import { showSucessToast } from '../../../shared/components/toasters/SucessToaster';
import { showErrorToast } from '../../../shared/components/toasters/ErrorToaster';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/users")
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        setLoading(false);
      });
  }, []);

  const handleToggleUserStatus = (userId, currentStatus) => {
    const requesterEmail = Cookies.get('email');
    if (!requesterEmail) {
      alert('E-mail do usuário não encontrado nos cookies.');
      return;
    }

    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";

    const payload = {
      id: userId,
      requester_email: requesterEmail,
    };

    axios.put("http://localhost:8000/toggleUserStatus", payload, {
      withCredentials: true
    })
      .then(() => {
        setUsers(users.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        ));
      })
      .catch(error => {
        console.error("Erro ao atualizar o status do usuário:", error);
        showErrorToast("Erro ao atualizar o status do usuário");
      });
  };

  const handleUserTypeChange = (userId, newUserType) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, user_type: newUserType } : user
    ));
  };

  const handleSaveUserRole = (userId, newRole) => {
    const requesterEmail = Cookies.get('email');
    if (!requesterEmail) {
      alert('E-mail do usuário não encontrado nos cookies.');
      return;
    }

    const payload = {
      id: userId,
      role: newRole,
      requester_email: requesterEmail
    };

    axios.put("http://localhost:8000/updateUserRole", payload, { withCredentials: true })
      .then(() => {
        // Exibe o toast de sucesso
        showSucessToast("Nível de usuário atualizado com sucesso!");

        // Recarregar os dados após salvar
        axios.get("http://localhost:8000/users")
          .then(response => {
            setUsers(response.data); // Atualiza o estado com os dados mais recentes
          })
          .catch(error => {
            console.error("Erro ao buscar usuários:", error);
            showErrorToast("Erro ao buscar usuários.");
          });
      })
      .catch(error => {
        console.error("Erro ao atualizar a role do usuário:", error);
        showErrorToast("Erro ao atualizar a role do usuário");
      });
  };

  if (loading) return <div>Carregando...</div>;

  // Filtra os usuários para mostrar apenas "admin", "user" e "master"
  const filteredUsers = users.filter(user => 
    ["admin", "user", "master"].includes(user.user_type)
  );

  // Separa os usuários ativos dos inativos
  const activeUsers = filteredUsers.filter(user => user.status === "ativo");
  const inactiveUsers = filteredUsers.filter(user => user.status === "inativo");

  // Prioriza os "master" no topo, depois ordena os outros por nome
  const sortedUsers = [
    ...activeUsers.filter(user => user.user_type === "master"),
    ...activeUsers.filter(user => user.user_type !== "master"),
    ...inactiveUsers.filter(user => user.user_type === "master"),
    ...inactiveUsers.filter(user => user.user_type !== "master")
  ];

  return (
    <Box sx={{ width: '98%', overflowX: 'auto', padding: 2 }}>
      <Paper sx={{ width: '100%', overflow: 'auto', boxShadow: 3 }}>
        <TableContainer>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#3f51b5' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Nome do Usuário</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Endereço de E-mail</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Status do Usuário</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Tipo de Usuário</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Ação</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedUsers.map(user => (
                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell sx={{ wordBreak: 'break-word' }}>{user.name}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-word' }}>{user.email}</TableCell>
                  <TableCell>
                    {user.status === "ativo" ? "Ativo" : "Inativo"}
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleToggleUserStatus(user.id, user.status)}
                      sx={{
                        marginLeft: 1,
                        minWidth: '80px',
                        backgroundColor: user.status === "ativo" ? '#d32f2f' : '#388e3c',
                        '&:hover': {
                          backgroundColor: user.status === "ativo" ? '#b71c1c' : '#2e7d32',
                        },
                      }}
                    >
                      {user.status === "ativo" ? "Inativar" : "Ativar"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Nível</InputLabel>
                      <Select
                        value={user.user_type || ""}
                        onChange={(e) => handleUserTypeChange(user.id, e.target.value)}
                        sx={{ backgroundColor: '#fff' }}
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="master">Master</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveUserRole(user.id, user.user_type)} // Salva a role
                      sx={{ marginLeft: 1 }}
                    >
                      Salvar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

      {/* Estilo opcional para remover scroll lateral da página */}
      <style>
        {`body { overflow-x: hidden; }`}
      </style>
    </Box>
  );
};

export default UserList;
