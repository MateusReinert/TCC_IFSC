import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useForm } from 'react-hook-form'; 
import PostForm from '../components/PostForm';
import Feed from '../../feed/page/Feed';
import axios from 'axios';

const HomePage = () => {
  const { register, handleSubmit, setValue } = useForm(); 
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Função para pegar o e-mail dos cookies
        const getEmailFromCookies = () => {
          return document.cookie.replace(/(?:(?:^|.*;\s*)email\s*=\s*([^;]*).*$)|^.*$/, "$1");
        };

        const email = getEmailFromCookies();  // Função para pegar o e-mail do cookie
        if (!email) {
          console.warn("E-mail não encontrado nos cookies.");
          return;
        }

        // Requisição GET para pegar o tipo de usuário
        const response = await axios.get('http://localhost:8000/get-user-type', {
          params: { email: email }, // Envia o e-mail como parâmetro na URL
        });

        const role = response.data.replace('Tipo de usuário: ', '').trim();
        console.log('Tipo de usuário:', role);
        setUserRole(role);
      } catch (error) {
        console.error('Erro ao obter o papel do usuário', error);
      }
    };

    fetchUserRole();
  }, []);  // Dependência vazia para executar apenas uma vez

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Box sx={{ marginBottom: 4 }}>
        {/* Verifica se o usuário é "master" para exibir o formulário */}
        {userRole === 'master' && (
          <PostForm 
            register={register} 
            handleSubmit={handleSubmit(onSubmit)} 
            setValue={setValue} 
          />
        )}
      </Box>

      <Feed />
    </Container>
  );
};

export default HomePage;
