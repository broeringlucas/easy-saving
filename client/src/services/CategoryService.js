import api from "../api";

export const CategoryService = {
  fetchAllCategoriesByUser: async (userId) => {
    const response = await api.get(`/categories/user/${userId}`);
    return response.data;
  },
  fetchAllCategoriesTotalSpent: async (userId, period) => {
    const response = await api.get(
      `/categories/user/${userId}/total?period=${period}`
    );
    return response.data;
  },
  fetchCategoryByName: async (userId, name) => {
    const response = await api.get(
      `/categories/user/${userId}/name/${encodeURIComponent(name)}`
    );
    return response.data;
  },
  createCategory: async (category) => {
    const response = await api.post("/categories", category);
    return response.data;
  },
  updateCategory: async (categoryId, category) => {
    const response = await api.put(`/categories/${categoryId}`, category);
    return response.data;
  },
  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};
