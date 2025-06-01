import { FaTrash } from "react-icons/fa";

const CategoryCard = ({ category, onDelete }) => {
  return (
    <div
      className="relative grid grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-md w-full hover:bg-gray-100 transition-all group mb-3 border-l-[6px] min-h-[50px] items-center"
      style={{ borderLeftColor: category.color }}
    >
      <div className="flex">
        <p className="text-[23px] font-bold" style={{ color: category.color }}>
          {category.name}
        </p>
      </div>
      <div className="flex">
        <p>+ R${category.total_income}</p>
      </div>
      <div className="flex justify-center">
        <p>- R${category.total_expense}</p>
      </div>
      <div className="flex justify-end">
        <p className="text-[18px] font-semibold">
          {category.total_income - category.total_expense > 0
            ? `+ R$${category.total_income - category.total_expense}`
            : `- R$${Math.abs(category.total_income - category.total_expense)}`}
        </p>
      </div>
      <button
        className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-500 hover:bg-red-100"
        onClick={() => onDelete(category.category_id)}
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default CategoryCard;
