import { useState, useEffect } from "react";
import api from "../api";
import TransactionCard from "../components/TransactionCard";
import TransactionForm from "../components/TransactionForm";
import FormModal from "../components/FormModal";
import CategoryForm from "../components/CategoryForm";
import Navbar2 from "../components/Navbar2";
import { use } from "react";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const response = await api.get("/users/user", { withCredentials: true });
    setUser(response.data);
    console.log("User:", response.data);
  };

  const fetchTransactions = async () => {
    const response = await api.get(`/transactions/user/${user.user_id}`, {
      withCredentials: true,
    });
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
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const incomeTotal = transactions
    .filter((t) => t.type === 1)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = incomeTotal - expenseTotal;

  console.log("Transactions:", transactions);

  return (
    <div>
      <div className="flex justify-center space-x-4 mt-20 mb-10">
        <div className="py-2 px-6 rounded-lg shadow-lg w-90 text-left ">
          <p className="text-sm font-semibold">Income</p>
          <p className="text-2xl font-bold">
            {incomeTotal > 0 ? `+${incomeTotal}` : incomeTotal}
          </p>
        </div>

        <div className="py-2 px-6 rounded-lg shadow-lg w-90 text-left">
          <p className="text-sm font-semibold">Expense</p>
          <p className="text-2xl font-bold">
            {expenseTotal > 0 ? `-${expenseTotal}` : expenseTotal}
          </p>
        </div>

        <div className="py-2 px-6 rounded-lg shadow-lg w-90 text-left">
          <p className="text-sm font-semibold">Balance</p>
          <p className="text-2xl font-bold">
            {balance > 0
              ? `+${balance}`
              : balance < 0
              ? `-${Math.abs(balance)}`
              : balance}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 my-8">
        <button
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          className="flex items-center px-4 py-2 rounded-lg shadow-lg"
        >
          <span className="mr-2 text-xl">+</span>
          Nova Transação
        </button>

        <button
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="flex items-center px-4 py-2 rounded-lg shadow-lg"
        >
          <span className="mr-2 text-xl">+</span>
          Nova Categoria
        </button>
      </div>
      {showTransactionForm && (
        <FormModal onClose={() => setShowTransactionForm(false)}>
          <TransactionForm
            onTransactionAdded={() => {
              fetchTransactions();
              setShowTransactionForm(false);
            }}
            user={user}
          />
        </FormModal>
      )}

      {showCategoryForm && (
        <FormModal onClose={() => setShowCategoryForm(false)}>
          <CategoryForm
            onCategoryAdded={() => {
              setShowCategoryForm(false);
            }}
            user={user}
          />
        </FormModal>
      )}
      <div className="flex justify-center items-center mt-8">
        <div className="w-180 max-w-4xl">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.transaction_id}
              transaction={transaction}
              onDelete={handleDeleteTransaction}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
