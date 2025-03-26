import React from 'react';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form'; 
import PostForm from '../components/PostForm';


const HomePage = () => {
  const { register, handleSubmit, setValue } = useForm(); 

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Box>
      <h1>Criar uma Postagem</h1>
      <PostForm 
        register={register} 
        handleSubmit={handleSubmit(onSubmit)} 
        setValue={setValue} 
      />
    </Box>
  );
};

export default HomePage;
