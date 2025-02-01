import axios from "axios";

const API_URL = "http://localhost:3000"; 

export const authService = {
  postLogin: async (data) => {
    return axios.post(`${API_URL}/postLogin`, data);
  },
  
  postRegister: async (data) => {
    return axios.post(`${API_URL}/postRegister`, data);
  },

  postPerfilPage: async (data) => {
    return axios.post(`${API_URL}/postPerfilPage`, data);
  },
  postVisibilidadeDoPerfilPage: async (data) => {
    return axios.post(`${API_URL}/postVisibilidadeDoPerfilPage`, data);
  },

  postSenhaPage: async (data) => {
    return axios.post(`${API_URL}/postSenhaPage`, data);
  },

  postAlteracaoDeSenhaPage: async (data) => {
    return axios.post(`${API_URL}/postAlteracaoDeSenhaPage`, data);
  },

  postFontePage: async (data) => {  
    return axios.post(`${API_URL}/postFontePage`, data);
  },

  postPadroesDePrivacidadePage: async (data) => {
    return axios.post(`${API_URL}/postPadroesDePrivacidadePage`, data);
  },

  postSensibilidadeDeConteudoPage: async (data) => {
    return axios.post(`${API_URL}/postSensibilidadeDeConteudoPage`, data);
  }
};
