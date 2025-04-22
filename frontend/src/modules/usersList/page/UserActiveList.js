import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Paper, Box
} from '@mui/material';

const UserActiveList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/users")
      .then(response => {
        // Filtra apenas os usuários com user_type 'pending'
        const pendingUsers = response.data.filter(user => user.user_type === 'pending');
        setUsers(pendingUsers);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar usuários:", error);
        setLoading(false);
      });
  }, []);

  const handleUserApproval = (userId, decision) => {
    const requesterEmail = Cookies.get('email');
    if (!requesterEmail) {
      alert('E-mail do usuário não encontrado nos cookies.');
      return;
    }

    const newUserType = decision === 'approve' ? 'user' : 'reproved';

    const payload = {
      requester_email: requesterEmail,
      id: userId,
      role: newUserType
    };

    axios.put("http://localhost:8000/approveOrRejectUser", payload, {
      withCredentials: true
    })
      .then(response => {
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
        console.error("Erro ao atualizar tipo de usuário:", error);
      });
  };


  if (loading) return <div>Carregando...</div>;

  return (
    <Box sx={{ width: '100%', padding: 1 }}>
      <Paper sx={{ boxShadow: 3 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#3f51b5' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleUserApproval(user.id, 'approve')}
                      >
                        Aprovar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleUserApproval(user.id, 'reject')}
                      >
                        Reprovar
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Nenhum usuário pendente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
    </Box>
  );
};

export default UserActiveList;
