import axios from "axios";

const API_URL = "http://localhost:8000";

export const postService = {
  createPost: async (formData) => {
    try {
      console.log("Enviando dados para criar a postagem...");
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Verificação de sucesso
      console.log("Resposta recebida ao criar postagem:", response);
      if (response.status === 201) {
        return response.data; // Retorna os dados da resposta
      } else {
        throw new Error("Erro inesperado ao criar postagem.");
      }
    } catch (error) {
      console.error("Erro ao criar postagem:", error);
      throw error; // Retorna o erro para ser tratado no front
    }
  },

  getPosts: async () => {
    try {
      console.log("Buscando postagens...");
      const response = await axios.get(`${API_URL}/posts`);
      
      // Verificação de sucesso
      console.log("Resposta recebida ao buscar postagens:", response);
      if (response.status === 200) {
        return response.data; // Retorna os dados da resposta
      } else {
        throw new Error("Erro ao obter postagens.");
      }
    } catch (error) {
      console.error("Erro ao obter postagens:", error);
      throw error; // Retorna o erro para ser tratado no front
    }
  },
};
