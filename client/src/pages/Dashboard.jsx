import { useState, useEffect } from "react";
import api from "../api";
import { CategoryService } from "../services/CategoryService";
import CategoryCard from "../components/CategoryCard";
import FormModal from "../components/FormModal";
import CategoryForm from "../components/CategoryForm";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const fetchUser = async () => {
    const response = await api.get("/users/user", { withCredentials: true });
    setUser(response.data);
    console.log("User:", response.data);
  };

  const loadCategoriesTotalSpent = async () => {
    try {
      const data = await CategoryService.fetchAllTotalSpent(user.user_id);
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadCategoriesTotalSpent();
    }
  }, [user]);

  console.log("Categories:", categories);

  return (
    <div className="mt-10">
      <div className="w-130 max-w-2xl px-4 ml-15">
        <div className="flex justify-between gap-4">
          <p className="flex items-center ml-2">Categories</p>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-[#2ecc71] text-white hover:bg-[#27ae60] transition-colors duration-300"
          >
            <span className="mr-2 text-xl">+</span>
            Nova Categoria
          </button>
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
        </div>

        {categories.length > 0 && (
          <div className="hidden md:flex mb-4 p-6 bg-gray-100 rounded-lg justify-between items-center">
            <p className=" text-gray-500 font-semibold">Name</p>
            <p className=" text-gray-500 font-semibold">Income</p>
            <p className=" text-gray-500 font-semibold">Expense</p>
            <p className=" text-gray-500 font-semibold ">Balance</p>
          </div>
        )}
        {categories.map((category) => (
          <CategoryCard key={category.category_id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
