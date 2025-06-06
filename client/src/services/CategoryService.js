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

  fetchAllTotalSpent: async (userId, period) => {
    try {
      const response = await api.get(
        `/categories/user/${userId}/total?period=${period}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
