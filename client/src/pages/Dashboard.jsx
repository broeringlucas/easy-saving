import { useState, useEffect } from "react";
import api from "../api";
import TransactionCard from "../components/TransactionCard";
import TransactionForm from "../components/TransactionForm";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const response = await api.get("/transactions");
    setTransactions(response.data);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <TransactionForm onTransactionAdded={fetchTransactions} />
      <div>
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.transaction_id}
            transaction={transaction}
            onDelete={handleDeleteTransaction}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
