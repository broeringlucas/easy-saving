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
    <div
      className={`relative flex items-center p-6 bg-white rounded-lg shadow-md w-full mx-auto max-w-6xl hover:bg-gray-100 transition-all group mb-3 border-l-[6px] min-h-[100px]`}
      style={{ borderLeftColor: transaction.category?.color }}
    >
      <div className="flex flex-1 w-full items-center">
        <div className="w-[20%] pr-4">
          <p
            className="text-[23px] font-bold truncate"
            style={{ color: transaction.category?.color }}
          >
            {transaction.category?.name}
          </p>
        </div>
        <div className="w-[40%] pr-4">
          <p className="text-[18px] truncate">{transaction.description}</p>
        </div>
        <div className="w-[20%] pr-4">
          <p
            className={`text-[18px] font-semibold ${
              transaction.type === 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {transaction.type === 0 ? "-" : "+"} R$
            {Math.abs(transaction.amount).toFixed(2)}
          </p>
        </div>
        <div className="w-[20%] text-right pr-4">
          <p className="text-[15px] text-black">
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
