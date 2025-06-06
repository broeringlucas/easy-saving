import { useState, useEffect } from "react";
import api from "../api";
import TransactionCard from "../components/TransactionCard";
import TransactionForm from "../components/TransactionForm";
import FormModal from "../components/FormModal";
import CategoryForm from "../components/CategoryForm";

const Home = () => {
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

  return (
    <div>
      <div className="flex justify-center space-x-4 mt-10 mb-10 h-20">
        <div className="py-2 px-6 rounded-lg shadow-lg w-90 text-left border-l-3 border-[#2ecc71]">
          <p className="text-[15px] font-semibold mb-1">Income</p>
          <p className="text-[30px] font-bold text-[#2ecc71]">
            {incomeTotal > 0 ? `+${incomeTotal.toFixed(2)}` : incomeTotal}
          </p>
        </div>
        <div className="py-2 px-6 rounded-lg shadow-lg w-90 text-left border-l-3 border-[#e74c3c]">
          <p className="text-[15px] font-semibold mb-1">Expense</p>
          <p className="text-[30px] font-bold text-[#e74c3c]">
            {expenseTotal > 0 ? `-${expenseTotal.toFixed(2)}` : expenseTotal}
          </p>
        </div>
        <div
          className={`py-2 px-6 rounded-lg shadow-lg w-90 text-left border-l-3 ${
            balance > 0
              ? "border-[#2ecc71]"
              : balance < 0
              ? "border-[#e74c3c]"
              : "border-[#34495e]"
          }`}
        >
          <p className="text-[15px] font-semibold">Balance</p>
          <p
            className={`text-[30px] font-bold ${
              balance > 0
                ? "text-[#2ecc71]"
                : balance < 0
                ? "text-[#e74c3c]"
                : "text-[#34495e]"
            }`}
          >
            {balance > 0
              ? `+${balance.toFixed(2)}`
              : balance < 0
              ? `-${Math.abs(balance).toFixed(2)}`
              : balance}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 my-8">
        <button
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-[#2ecc71] text-white hover:bg-[#27ae60] transition-colors duration-300"
        >
          <span className="mr-2 text-xl">+</span>
          Nova Transação
        </button>

        <button
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-[#2ecc71] text-white hover:bg-[#27ae60] transition-colors duration-300"
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
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-4xl px-4">
          {transactions.length > 0 && (
            <div className="hidden md:flex mb-4 p-4 bg-gray-100 rounded-lg justify-between items-center">
              <div className=" text-gray-500 font-semibold pr-4">Categoria</div>
              <div className=" text-gray-500 font-semibold pr-4">Descrição</div>
              <div className=" text-gray-500 font-semibold text-right pr-4">
                Valor
              </div>
              <div className=" text-gray-500 font-semibold text-right pr-4">
                Data
              </div>
            </div>
          )}
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

export default Home;
