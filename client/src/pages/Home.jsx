import { useState, useEffect } from "react";

import TransactionCard from "../components/TransactionCard";
import TransactionForm from "../components/TransactionForm";
import FormModal from "../components/FormModal";
import CategoryForm from "../components/CategoryForm";
import IntervalSelect from "../components/IntervalSelect";

import { TransactionService } from "../services/TransactionService";
import { UserService } from "../services/UserService";

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("total");

  const fetchUser = async () => {
    const response = await UserService.fetchUser();
    setUser(response);
  };

  const loadTransactions = async (period) => {
    const response = await TransactionService.fetchAllTransactionsByUser(
      user.user_id,
      period
    );
    setTransactions(response);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await TransactionService.deleteTransaction(id);
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
    loadTransactions(selectedPeriod);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadTransactions(selectedPeriod);
    }
  }, [user, selectedPeriod]);

  const incomeTotal = transactions
    .filter((t) => t.type === 1)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseTotal = transactions
    .filter((t) => t.type === 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = incomeTotal - expenseTotal;

  return (
    <div className="mt-10 px-6 lg:px-10">
      <IntervalSelect value={selectedPeriod} onChange={setSelectedPeriod} />
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
        <div className="flex-1 min-w-[250px] max-w-[400px] py-4 px-6 rounded-lg shadow-lg text-left border-l-4 border-p-green">
          <p className="text-base sm:text-lg font-semibold mb-1">Income</p>
          <p className="text-2xl sm:text-3xl font-bold text-p-green">
            {incomeTotal > 0
              ? `+${incomeTotal.toFixed(2)}`
              : incomeTotal.toFixed(2)}
          </p>
        </div>
        <div className="flex-1 min-w-[250px] max-w-[400px] py-4 px-6 rounded-lg shadow-lg text-left border-l-4 border-p-red">
          <p className="text-base sm:text-lg font-semibold mb-1">Expense</p>
          <p className="text-2xl sm:text-3xl font-bold text-p-red">
            {expenseTotal > 0
              ? `-${expenseTotal.toFixed(2)}`
              : expenseTotal.toFixed(2)}
          </p>
        </div>
        <div
          className={`flex-1 min-w-[250px] max-w-[400px] py-4 px-6 rounded-lg shadow-lg text-left border-l-4 ${
            balance > 0
              ? "border-p-green"
              : balance < 0
              ? "border-p-red"
              : "border-p-gray"
          }`}
        >
          <p className="text-base sm:text-lg font-semibold">Balance</p>
          <p
            className={`text-2xl sm:text-3xl font-bold ${
              balance > 0
                ? "text-p-green"
                : balance < 0
                ? "text-p-red"
                : "text-p-gray"
            }`}
          >
            {balance > 0
              ? `+${balance.toFixed(2)}`
              : balance < 0
              ? `-${Math.abs(balance).toFixed(2)}`
              : balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 my-8">
        <button
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-p-green text-white hover:bg-s-green transition-colors duration-300"
        >
          <span className="mr-2 text-xl">+</span>
          New Transaction
        </button>

        <button
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-p-green text-white hover:bg-s-green transition-colors duration-300"
        >
          <span className="mr-2 text-xl">+</span>
          New Category
        </button>
      </div>
      {showTransactionForm && (
        <FormModal onClose={() => setShowTransactionForm(false)}>
          <TransactionForm
            onTransactionAdded={() => {
              loadTransactions(selectedPeriod);
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
              <div className=" text-gray-500 font-semibold pr-4">Category</div>
              <div className=" text-gray-500 font-semibold pr-4">
                Description
              </div>
              <div className=" text-gray-500 font-semibold text-right pr-4">
                Value
              </div>
              <div className=" text-gray-500 font-semibold text-right pr-4">
                Date
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
