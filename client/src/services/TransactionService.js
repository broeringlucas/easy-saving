import api from "../api";

export const TransactionService = {
  createTransaction: async (transaction) => {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },
  deleteTransaction: async (transactionId) => {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  },
  fetchAllTransactionsByUser: async (userId, period) => {
    const response = await api.get(
      `/transactions/user/${userId}?period=${period}`
    );
    return response.data;
  },
  fetchMonthlyTransactionsByUser: async (userId, period) => {
    const response = await api.get(
      `/transactions/summary/monthly/${userId}?period=${period}`
    );
    return response.data;
  },
};
