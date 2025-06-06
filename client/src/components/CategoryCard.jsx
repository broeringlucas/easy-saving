import { FaTrash, FaEdit } from "react-icons/fa";

const CategoryCard = ({ category, onDelete, onEdit }) => {
  const balance = category.total_income - category.total_expense;

  return (
    <div
      className="relative grid grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-md w-full hover:bg-gray-100 transition-all group mb-3 border-l-[6px] h-25 items-center"
      style={{ borderLeftColor: category.color }}
    >
      <p
        className="text-[23px] font-bold truncate"
        style={{ color: category.color }}
      >
        {category.name}
      </p>
      <p
        className={`text-[18px] font-semibold ${
          category.total_income > 0 ? "text-[#2ecc71]" : "text-[#34495e]"
        }`}
      >
        {category.total_income > 0 ? `+ R$${category.total_income}` : "R$0"}
      </p>
      <p
        className={`text-[18px] font-semibold text-center ${
          category.total_expense > 0 ? "text-[#e74c3c]" : "text-[#34495e]"
        }`}
      >
        {category.total_expense > 0 ? `- R$${category.total_expense}` : "R$0"}
      </p>
      <p
        className={`flex justify-end text-[18px] font-semibold ${
          balance > 0
            ? "text-[#2ecc71]"
            : balance < 0
            ? "text-[#e74c3c]"
            : "text-[#34495e]"
        }`}
      >
        {balance > 0
          ? `+ R$${balance.toFixed(2)}`
          : balance < 0
          ? `- R$${Math.abs(balance).toFixed(2)}`
          : `R$${balance}`}
      </p>
      <button
        className="absolute right-[-40px] top-[30%] transform -translate-y-1/2 p-2 rounded-full text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-blue-500 hover:bg-blue-100"
        onClick={() => onEdit(category.category_id)}
      >
        <FaEdit size={20} />
      </button>
      <button
        className="absolute right-[-40px] top-[70%] transform -translate-y-1/2 p-2 rounded-full text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-500 hover:bg-red-100"
        onClick={() => onDelete(category.category_id)}
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default CategoryCard;
