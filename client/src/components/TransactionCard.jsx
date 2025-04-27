import { FaTrash } from "react-icons/fa";

const TransactionCard = ({ transaction, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="relative flex items-center p-4 bg-white rounded-lg shadow-md max-w-x1 hover:bg-gray-100 transition-all group mb-1">
      <div
        className="w-10 h-10 rounded-full flex-shrink-0"
        style={{ backgroundColor: transaction.category?.color }}
      ></div>
      <div className="flex flex-col flex-1 ml-4">
        <div className="flex items-center justify-between gap-x-4">
          <p className="text-lg font-bold">{transaction.description}</p>
          <p
            className={`text-sm font-semibold ${
              transaction.type === 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            R$ {transaction.amount}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4 text-sm text-gray-600">
          <p className="text-sm" style={{ color: transaction.category?.color }}>
            {transaction.category?.name}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>
      <button
        className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-500 hover:bg-red-100"
        onClick={() => onDelete(transaction.transaction_id)}
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default TransactionCard;
