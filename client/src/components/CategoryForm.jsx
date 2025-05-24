import { useState } from "react";
import api from "../api";

const CategoryForm = ({ onCategoryAdded, user }) => {
  const [category, setCategory] = useState({
    name: "",
    color: "#3b82f6",
    user: user.user_id,
  });
  const [errors, setErrors] = useState({
    name: "",
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (formError) setFormError(null);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
    };
    let isValid = true;

    if (!category.name.trim()) {
      newErrors.name = "O nome da categoria é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await api.get(
        `/categories/user/${user.user_id}/name/${encodeURIComponent(
          category.name
        )}`
      );

      if (response.data.length > 0) {
        setErrors({
          ...errors,
          name: "Já existe uma categoria com este nome.",
        });
        return;
      }

      await api.post("/categories", {
        name: category.name,
        color: category.color,
        user: category.user,
      });

      setCategory({ name: "", color: "#3b82f6", user: user.user_id });
      setErrors({ name: "" });
      setFormError(null);
      onCategoryAdded();
    } catch (error) {
      console.error(error);
      setFormError("Erro ao criar categoria. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Nova Categoria
      </h2>

      {formError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nome:
        </label>
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          maxLength={50}
          placeholder="Ex: Alimentação"
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Cor:
        </label>
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-md border border-gray-300 shadow-sm"
            style={{ backgroundColor: category.color }}
          />

          <div className="relative flex-1">
            <input
              type="color"
              value={category.color}
              onChange={(e) =>
                setCategory({ ...category, color: e.target.value })
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between hover:border-gray-400">
              <span className="text-sm font-mono">
                {category.color.toUpperCase()}
              </span>
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full mt-4 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Criar Categoria
      </button>
    </form>
  );
};

export default CategoryForm;
