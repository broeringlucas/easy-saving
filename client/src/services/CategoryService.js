import api from "../api";

export const CategoryService = {
  fetchAll: async (userId) => {
    try {
      const response = await api.get(`categories/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
      throw error;
    }
  },

  fetchAllTotalSpent: async (userId) => {
    try {
      const response = await api.get(`categories/user/${userId}/total`);
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar total gasto por categoria", error);
      throw error;
    }
  },
};
